[![NPM](https://nodei.co/npm/localer.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/localer/)

# Localer
Locales collector from js sources.


# API

### Array<Object> traverseFile(String file)
Collect locales from file.


### Array<Object> traverseGlob(Array<String> masks)
Collect locales from files by glob pattern.


### String terminalReport(Array<Object>|Object{added:Array<Object>, unused:Array<String>} info, Boolean withPlain = false)
Generate report for terminal.


### String htmlReport(Array<Object>|Object{added:Array<Object>, unused:Array<String>} info, Boolean withPlain = false)
Generate report as html.


### Object{added:Array<Object>, unused:Array<String>} diff(Array<Object> info, String pathToJson)
Show difference info.


# Global usage

```
localer [...glob patterns] [--html to generate html] [--summary to show list of added and unused locales] [--compare [path to file] to show difference]
```
