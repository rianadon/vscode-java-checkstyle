# VS Code checkstyle linter

A linter for Java code that uses [checkstyle], based on the [package for Atom][linter-checkstyle].

## Settings

* `checkstyle.enable`: set whether checkstyle linting is enabled for the workspace or global environment. By default linting is enabled.

* `checkstyle.checkstylePath`: The path to either the checkstyle executable or the checkstyle command.

    If you installed checkstyle [via Homebrew][checkstyle from homebrew], then this is the path to the checkstyle executable. Otherwise, this is the path to the jar downloaded from the [checkstyle downloads page][checkstyle downloads].

* `checkstyle.configurationPath`: The path to the checkstyle configuration file. Setting this to `null` is the equivalent of not passing the `-c` option to checkstyle.

[checkstyle]: http://checkstyle.sourceforge.net/
[linter-checkstyle]: https://github.com/SebastianSzturo/linter-checkstyle
[checkstyle from homebrew]: http://brewformulas.org/Checkstyle
[checkstyle downloads]: http://checkstyle.sourceforge.net/index.html#Download
[vscode-eslint]: https://github.com/Microsoft/vscode-eslint
[vscode-languageserver-node-example]: https://github.com/Microsoft/vscode-languageserver-node-example
