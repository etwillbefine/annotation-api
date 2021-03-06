#### HTTP POST /test

__Query:__
```json
{
    "page": {
        "required": true,
        "type": "number"
    }
}
```
__Request:__
```json
{
    "name": {
        "required": true,
        "type": "string",
        "rules": {
            "minLength": 5,
            "maxLength": 25
        }
    },
    "email": {
        "required": true,
        "type": "string",
        "rules": {
            "minLength": 5
        }
    },
    "password": {
        "required": true,
        "type": "string",
        "rules": {
            "minLength": 8
        }
    },
    "token": {
        "required": true,
        "type": "string",
        "rules": {
            "equals": "handshake"
        }
    }
}
```
Status: 200
#### HTTP GET /test

__Query:__
```json
{
    "test": {
        "required": true,
        "type": "number",
        "rules": {
            "min": 1,
            "max": 10
        }
    },
    "number": {
        "required": true,
        "rules": {
            "equals": 100
        }
    }
}
```
Status: 200
