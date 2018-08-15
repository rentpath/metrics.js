# Metrics.js

Provides a cli tool packaged with `pkg` to retrieve performance metrics from a control url and compare it to a target url.

Emits a markdown table to STDOUT that you can use as a report or to add as a comment on GitHub.

## Usage

```
  Usage: metrics [options]

  Options:

    -V, --version        output the version number
    -m, --mobile         Use mobile user agent
    --psi-key [psiKey]   Page Speed Insights API key
    --control [control]  Specify the URL to be used as the control to compare against
    --target [target]    Specify the URL to be used as the target of the comparison
    -h, --help           output usage information
```

## License

MIT

Copyright © 2018 RentPath
