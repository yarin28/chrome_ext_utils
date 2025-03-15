#!/usr/bin/env fish

# Description: Export all dependencies of a project into .tgz files for eazy portability
# Dependencies: npm-deep-pack, jq

# File to store dependencies
set deps_file "dependencies.txt"
rm -f $deps_file # Remove the file if it exists

# Find all package.json files, excluding node_modules
for file in (find . -name "package.json" -not -path "*/node_modules/*")
    jq -r '.dependencies, .devDependencies | keys[]?' $file >>$deps_file
end

# Remove duplicates and sort
sort -u $deps_file -o $deps_file

# Count total dependencies
set total (wc -l < $deps_file | tr -d ' ')
set count 0

# Run command on each dependency with progress bar
for dep in (cat $deps_file)
    set count (math $count + 1)
    set percent (math "($count / $total) * 100")

    # Move cursor to the top and clear previous output
    printf "\033[H\033[J"

    # Print status heading
    echo -e "🔄 Processing Dependencies\n"

    # Show refreshed progress bar
    printf "[%-50s] %3.0f%%\n\n" (string repeat -n (math "round($percent / 2)") "#") $percent

    # Print command being executed
    npx npm-deep-pack $dep -dev
    echo "Executing: npx npm-deep-pack $dep -dev"
    echo --------------------------------------

    # Run command and capture output
    set output (npx npm-deep-pack $dep -dev 2>&1)

    # Print output
    echo "$output"

    # Wait for user to see output, then erase it for next command
    #sleep 1 # Adjust as needed

end

# Final status update
printf "\033[H\033[J" # Clear screen
echo "✅ All dependencies processed successfully!"
