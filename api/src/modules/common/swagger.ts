import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'CelebAI API',
            version: '1.0.0',
            description: 'API documentation for CelebAI API',
        },
        servers: [
            { url: 'https://api-staging.celebapi.com/api/v1' },
            { url: 'http://localhost:8080/api/v1' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            // schemas: {
            //     Provider: {
            //         type: 'object',
            //         properties: {
            //             // Define properties of the Provider model
            //             id: {
            //                 type: 'integer',
            //             },
            //             name: {
            //                 type: 'string',
            //             },
            //         },
            //     },
            // },
        },
    },
    apis: ['**/*.ts'], // Update this path based on your project structure and file extension
};

const specs = swaggerJsdoc(options);

export default specs;
