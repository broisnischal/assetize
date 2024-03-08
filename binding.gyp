{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "src/addon.cc",
        "src/node_version.h"
      ],
      "include_dirs": ["<!(node -e \"require('nan')\")"]
    }
  ]
}