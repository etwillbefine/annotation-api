# Filters

Define your filter in `@Body` or `@Query` annotation using keyword `rules`:  
`rules: { ..., ... }`

- `minLength: number`  
- `maxLength: number`  
- `equals: string`  
- `regexp: string`  
- `in: Array<string>`  
- `notIn: Array<string>`  
