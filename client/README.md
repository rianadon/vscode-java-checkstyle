# VS Code checkstyle linter

A linter for Java code that uses [checkstyle], based on the [package for Atom][linter-checkstyle].

## Settings

* `checkstyle.enable`: set whether checkstyle linting is enabled for the workspace or global environment. By default linting is enabled.

* `checkstyle.checkstylePath`: The path to either the checkstyle executable or the checkstyle command.

    If you installed checkstyle [via Homebrew][checkstyle from homebrew], then this is the path to the checkstyle executable. Otherwise, this is the path to the jar downloaded from the [checkstyle downloads page][checkstyle downloads].

* `checkstyle.configurationPath`: The path to the checkstyle configuration file. Setting this to `null` is the equivalent of not passing the `-c` option to checkstyle.

## Acknowledgements

Thank you to the projects that served both as inspiration and as a basis for this extension:

* [checkstyle], the sole reason why this extension exists
* [linter-checkstyle], for sorting out how to parse checkstyle's output
* [vscode-eslint], for showing how a good VSCode linter is designed
* [vscode-languageserver-node-example], without which I would have been completely lost

[checkstyle]: http://checkstyle.sourceforge.net/
[linter-checkstyle]: https://github.com/SebastianSzturo/linter-checkstyle
[checkstyle from homebrew]: http://brewformulas.org/Checkstyle
[checkstyle downloads]: http://checkstyle.sourceforge.net/index.html#Download
[vscode-eslint]: https://github.com/Microsoft/vscode-eslint
[vscode-languageserver-node-example]: https://github.com/Microsoft/vscode-languageserver-node-example
