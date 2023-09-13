# SwiftServe - Express-Like Web Server built on top of the Bun

This is a simple Express-like application built using Bun.js, a lightweight web framework. It provides a basic example of creating routes and serving responses. You can use this as a starting point for building more complex applications.

## Installation

```bash
bun add swiftserve
```

## Getting Started

```ts
import swiftserve from "swiftserve";

const app = swiftserve(/* options can be here. Practically same options with Bun.serve */);

// Define a middleware function that logs the request method and URL
app.use((req, res) => {
   console.log(`Received ${req.method} request for ${req.url}`);
});

// Define a route for the "/hello-world" endpoint that returns "Hello World"
app.get('/hello-world', async (req, res) => {
  return res.text('Hello World');
});

// Define a catch-all route that returns a JSON response with a message
app.all('*', async (req, res) => {
  return res.json({ message: 'Hello World' });
});

// Use cors if needed
app.use(swiftserve.cors());

// use static files if needed
app.use(swiftserve.static('/path/to/static/files'));

// Start the server
app.serve();
console.log("Http server run on http://localhost:3000");

// Close the server when it becomes necessary
app.close();
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