typedef struct
{
  uint32_t major;
  uint32_t minor;
  uint32_t patch;
  const char *release;
} napi_node_version;

napi_status napi_get_node_version(node_api_nogc_env env,
                                  const napi_node_version **version);