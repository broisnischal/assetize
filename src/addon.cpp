
#include <node.h>

void Sum(const v8::FunctionCallbackInfo<v8::Value> &args)
{
  v8::Isolate *isolate = args.GetIsolate();
  printf("hello\n");

  v8::Local<v8::Number> sum = v8::Number::New(isolate, 2 + 2);
  args.GetReturnValue().Set(sum);
}

void initalized(v8::Local<v8::Object> exports)
{
  NODE_SET_METHOD(exports, "addon", Sum);
}

NODE_MODULE(addon, initalized)
