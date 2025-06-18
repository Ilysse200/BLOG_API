import { url } from "inspector";
import { title } from "process";
import swaggerAutogen from "swagger-autogen";
const doc = {
    info:{
        version: 'v1.0.0',
        title: 'Blog API and UserManagement API',
        description:'Blog API is a system that allows different users to log in and navigate through the blog platform. Users are authenticated and their access is controlled to ensure the blog services is delivered appropriatelty.'
    },
    // host:`localhost:${process.env.PORT || 8080}`,
    // basePath:'/',
    // schemes: ['http', 'https'],
    servers:[
        {
            url:'http://localhost:3000',
        },
    ],
    components:{
        securitySchemes:{
            bearerAuth:{
                type:'http',
                scheme:'bearer',
            }
        }
    },
    schemas:{
        // type:object

    }
};
const outputFile = './swagger-output.json';
const endpointsFiles = ['src/routes/index.ts'];

swaggerAutogen({openapi:'3.0.0'})(outputFile, endpointsFiles, doc);