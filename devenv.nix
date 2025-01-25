{ pkgs, lib, config, inputs, ... }:
let
  pkgs-unstable =
    import inputs.nixpkgs-unstable { system = pkgs.stdenv.system; };
in {
  # https://devenv.sh/basics/
  env.GREET = "devenv";

  # https://devenv.sh/packages/
  packages = [
    pkgs.git
    pkgs.nodejs_23
    (pkgs.nodePackages.pnpm.override { nodejs = pkgs.nodejs_23; })
  ];
  # https://devenv.sh/languages/

  # https://devenv.sh/processes/
  # processes.fast-api_dev_server.exec = "fastapi dev";

  # https://devenv.sh/services/
  # services.postgres.enable = true;

  # https://devenv.sh/scripts/
  scripts.hello.exec = ''
    echo hello from $GREET
  '';

  enterShell = ''
    hello
  '';

  # https://devenv.sh/tasks/
  # tasks = {
  #   "myproj:setup".exec = "mytool build";
  #   "devenv:enterShell".after = [ "myproj:setup" ];
  # };

  # https://devenv.sh/tests/
  enterTest = ''
    echo "Running tests"
  '';

  # https://devenv.sh/pre-commit-hooks/
  # pre-commit.hooks.shellcheck.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}
