# SwiftServe - Express-Like Web Server built on top of the Bun

This is a simple Express-like application built using Bun.js, a lightweight web framework. It provides a basic example of creating routes and serving responses. You can use this as a starting point for building more complex applications.

## Installation

```bash
bun add swiftserve
```

## Getting Started

```ts
import "swiftserve";

const app = Bun.create(/* options here or default */);

// Define a route for the "/hello-world" endpoint that returns "Hello World"
app.get('/hello-world', async (req, res) => {
  return res.text('Hello World');
});

// Define a catch-all route that returns a JSON response with a message
app.all('*', async (req, res) => {
  return res.json({ message: 'Hello World' });
});

// Start the server
app.serve();
```

## Running the Application

```bash
bun run <file>
```

This will start the server, and you can access it by opening a web browser and navigating to http://localhost:3000/hello-world or any other URL.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! If you have any improvements or suggestions, feel free to open an issue or create a pull request.

Happy coding! 😊