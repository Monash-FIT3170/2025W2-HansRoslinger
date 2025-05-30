# myapp/myapp/README.md

# MyApp

This project demonstrates how to run a simple Python application inside a Docker container.

## Files

- `app.py`: A Python script that prints "Hello from Docker!" to the console.
- `Dockerfile`: Configuration file for building the Docker image.

## Getting Started

To build and run the Docker container, follow these steps:

1. **Build the Docker image**:
   ```bash
   docker build -t myapp .
   ```

2. **Run the Docker container**:
   ```bash
   docker run myapp
   ```

You should see the output:
```
Hello from Docker!
``` 

## Requirements

- Docker must be installed on your machine.