import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { apiKeyController } from '../controllers/apikey.controller.js'
import {
  CreateApiKeyRequestSchema,
  CreateApiKeyResponseSchema,
  ListApiKeysResponseSchema,
  DeleteApiKeyResponseSchema,
  ErrorResponseSchema,
} from '../dtos/apikey.dto.js'
import {
  VerifyApiKeyRequestSchema,
  VerifyApiKeySuccessSchema,
  VerifyApiKeyErrorResponseSchema,
} from '../dtos/verify-apikey.dto.js'
import { z } from 'zod'

const app = new OpenAPIHono()

// Create API Key
const createApiKeyRoute = createRoute({
  method: 'post',
  path: '/create',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateApiKeyRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: CreateApiKeyResponseSchema,
        },
      },
      description: 'Success',
    },
    401: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'Unauthorized',
    },
    500: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'Internal Server Error',
    },
  },
})

app.openapi(createApiKeyRoute, (c) => apiKeyController.create(c))

// List API Keys
const listApiKeysRoute = createRoute({
  method: 'get',
  path: '/list',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ListApiKeysResponseSchema,
        },
      },
      description: 'Success',
    },
    401: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'Unauthorized',
    },
    500: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'Internal Server Error',
    },
  },
})

app.openapi(listApiKeysRoute, (c) => apiKeyController.list(c))

// Delete API Key
const deleteApiKeyRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: DeleteApiKeyResponseSchema,
        },
      },
      description: 'Success',
    },
    401: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'Unauthorized',
    },
  },
})

app.openapi(deleteApiKeyRoute, (c) => apiKeyController.delete(c))

// Verify API Key
const verifyApiKeyRoute = createRoute({
  method: 'post',
  path: '/verify',
  request: {
    body: {
      content: {
        'application/json': {
          schema: VerifyApiKeyRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: VerifyApiKeySuccessSchema,
        },
      },
      description: 'Success',
    },
    400: {
      content: {
        'application/json': {
          schema: VerifyApiKeyErrorResponseSchema,
        },
      },
      description: 'Bad Request',
    },
    401: {
      content: {
        'application/json': {
          schema: VerifyApiKeyErrorResponseSchema,
        },
      },
      description: 'Unauthorized',
    },
    500: {
      content: {
        'application/json': {
          schema: VerifyApiKeyErrorResponseSchema,
        },
      },
      description: 'Internal Server Error',
    },
  },
})

app.openapi(verifyApiKeyRoute, (c) => apiKeyController.verify(c))

export default app
