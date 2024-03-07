# OCP Upgrade Path


## Overview

Find OCP upgrade path, based on this document:

https://sharma-hina.medium.com/successfully-upgrade-openshift-cluster-on-a-disconnected-environment-with-troubleshooting-guide-e5ad32541d7a


## Usage

- `$ node app [currentversion] [targetversion]`
  - currentversion: Current OCP version(before upgrade)
  - targetversion: Target OCP version(after upgrade)

- Ex. If your OCP is version **4.4.6**, and you want to upgrade to **4.6.4**, then you would try this command:
  - `$ node app 4.4.6 4.6.4`

- Result would be displayed like this:
  - `4.4.6 -> 4.4.13 -> 4.5.16 -> 4.6.4`

  - This means you should ...
    - (1) upgrade from 4.4.6 to 4.4.13 first,
    - (2) next, upgrade from 4.4.13 to 4.5.16,
    - (3) and, upgrade from 4.5.16 to 4.6.4.

    - Those all 3 upgrades are supposed to be possible(= supported, based on `release.txt`).


## Licensing

This code is licensed under MIT.


---

## Copyright

2024  [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.
