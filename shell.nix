{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_23
    (nodePackages.pnpm.override { nodejs = nodejs_23; })
  ];
}
