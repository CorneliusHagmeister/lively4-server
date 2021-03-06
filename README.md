# lively4-server
Alternative to accessing GitHub directly

## Publict Example Instances ...

- https://lively-kernel.org/lively4/
- https://lively-kernel.org/lively4S2/

# Setup

`gulp` is needed to run the babel transpilation tasks and to start the server. Therefore install it (globally), then install the dependencies.

```
cd lively4-server
npm install -g gulp
npm install
```

The server search exists in an external repository and is included as a git submodule. Therefore:
```
git submodule init
git submodule update
```

Then run 
```
gulp
```
This will first transpile the code in the `src` folder and write it to `dist`, then start the server. You can also configure the served directory and the port, e.g.
```
gulp -p 8080 -d ../foo/bar
```

During development you can use 
```
gulp watch -p 8080 -d ../foo/bar
```
which will automatically watch files in `src` folder and initiate a transpilation and server restart on changes.

**!!!Update the rest of this readme!!!**


Then, either run `node httpServer.js` directly, or use a script like bin/lively4S1.sh

Configure the served directory with `--directory=path/to/dir`.

# Self-supporting development of lively4-server

We use two instances of lively4-server to evolve the system in a self supporting way.
The two server have each their own checkout of the git repository. 

Each server gets restarted in an endless loop, so errors will lead to a server restart. 

## Server Updating

An external watcher observes changes to the source file and restarts the server accordingly. 

- a) The first server pulls changes from github before (re-)starting
- b) The source of the second server can be changed from within lively4 and pushed to github

## Development / Deployment Cycles

This setup allows for two differntly long development cycles that depend on each other.

The second server allows for a very short feedback loops of changing code and restarting the server automatically. The changes can break the second server in any way without interrupting the development process. Once the server runs stable again, the changes can be commited and pushed to githup. 

Once the new code is on github the first server can be asked to restart itself and before doing so, the new code gets pulled from github. If by any chances the server crashes, it will continously try to pull changes from github, allowing to push fixes from the second server to github or make the changes directly on github. 

There might be problems that will require admin access or similar to the server, but these occasions should be minimalized with the new development workflow. 


## Submodules

### Add

```
git subtree add -P src/lively4-search https://github.com/LivelyKernel/lively4-search.git master
```

## Pull

```
git subtree pull -P src/lively4-search https://github.com/LivelyKernel/lively4-search.git master
```

## Push

```
git subtree push -P src/lively4-search https://github.com/LivelyKernel/lively4-search.git master
```


