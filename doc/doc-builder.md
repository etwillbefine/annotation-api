# Doc Builder

*Be aware, do not run this command in production mode. It might could slow down your system for a moment.*

[Example](sample/overview.md)

### Run from project root
```bash
node node_modules/annotation-api/cli doc-builder <target-path> ./my-routes/actions/**/*.js [./more/**/*.js]
```

`target-path` must be absolute. 

#### Doc-Types
Currently there is only the `md`-Type available. 
