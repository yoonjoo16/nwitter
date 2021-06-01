It is troublesome to write `import AppRouter from "./Router"` or `import firebase from "../firebase"` with dots. To use absolute import, we can simply create a file 'json and write: 

```
{
  "compilerOptions": {
    "baseUrl": "src"
  },
  "include": ["src"]
}
```
Then, we skip the relative import with dots.
