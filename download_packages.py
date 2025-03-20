import os
import shutil
import json
import subprocess
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TimeElapsedColumn

# Configuration
PROJECT_ROOT = "./"  # Update this path
PACKAGE_REPO = "./tar_deps/"  # Update this path
TOOLING_DIRS = ["tools", ".bin", "scripts"]  # Directories to move with tooling
console = Console()


def find_package_json_files(root_dir):
    """Recursively find all package.json files."""
    package_files = []
    for dirpath, _, filenames in os.walk(root_dir):
        if "package.json" in filenames:
            package_files.append(os.path.join(dirpath, "package.json"))
    return package_files


def run_npm_deep_pack(package_name):
    """Run npm-deep-pack for a given package and display status."""
    try:
        result = subprocess.run(
            [
                "./node_modules/.bin/npm-deep-pack",
                "--out_deps",
                "tar_deps",
                package_name,
            ],
            capture_output=True,
            text=True,
            check=True,
        )
        return f"[green]✔ Success[/green]: {package_name}\n{result.stdout}"
    except subprocess.CalledProcessError as e:
        return f"[red]✖ Failed[/red]: {package_name}\n{e.stderr}"


def copy_to_repository(source, dest):
    """Copy files or directories to the package repository."""
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(source, dest)
    print(f"Copied {source} to {dest}")


def extract_dependencies(root_dir):
    """Extract dependencies and devDependencies from all package.json files."""
    package_files = find_package_json_files(root_dir)
    all_packages = {}

    for package_json in package_files:
        with open(package_json, "r", encoding="utf-8") as f:
            data = json.load(f)

        dependencies = data.get("dependencies", {})
        dev_dependencies = data.get("devDependencies", {})

        # Combine dependencies and devDependencies
        all_packages.update(dependencies)
        all_packages.update(dev_dependencies)

    return all_packages


def process_packages_with_progress(packages):
    """Run npm-deep-pack for each package with a progress bar."""
    with Progress(
        SpinnerColumn(), *Progress.get_default_columns(), TimeElapsedColumn()
    ) as progress:
        task = progress.add_task("[cyan]Processing packages...", total=len(packages))

        for package in packages:
            status = run_npm_deep_pack(package)
            console.print(status)
            progress.update(task, advance=1)


def main():
    packages = extract_dependencies(PROJECT_ROOT)
    # remove packages with certin keywords
    remove_list = [
        "@extension",
    ]
    for key in remove_list:
        packages.pop(key, None)
    print(f"Found {len(packages)} packages")
    process_packages_with_progress(packages)


if __name__ == "__main__":
    main()
