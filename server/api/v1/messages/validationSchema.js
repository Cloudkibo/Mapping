exports.messagePayload = {
  type: 'object',
  properties: {
    recipient_type: {
      type: 'string',
      required: false
    },
    to: {
      type: 'string',
      required: true
    },
    type: {
      type: 'string',
      required: false
    },
    preview_url: {
      type: 'boolean',
      required: false
    },
    text: {
      type: 'object',
      properties: {
        body: {
          type: 'string',
          required: true
        }
      },
      required: false
    },
    image: {
      type: 'object',
      properties: {
        caption: {
          type: 'string',
          required: true
        },
        id: {
          type: 'string',
          required: true
        }
      },
      required: false
    },
    audio: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          required: true
        }
      },
      required: false
    },
    document: {
      type: 'object',
      properties: {
        caption: {
          type: 'string',
          required: true
        },
        id: {
          type: 'string',
          required: true
        }
      },
      required: false
    },
    hsm: {
      type: 'object',
      properties: {
        namespace: {
          type: 'string',
          required: true
        },
        element_name: {
          type: 'string',
          required: true
        },
        language: {
          type: 'object',
          properties: {
            policy: {
              type: 'string',
              required: true
            },
            code: {
              type: 'string',
              required: true
            }
          },
          required: true
        },
        localizable_params: {
          type: 'array',
          required: true
        }
      },
      required: false
    }
  }
}
