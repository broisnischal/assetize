

#include <node.h>

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Object;
using v8::String;
using v8::Value;

void Hello(const FunctionCallbackInfo<Value> &args)
{
  Isolate *isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "hello world"));
}

void Method(const FunctionCallbackInfo<Value> &args)
{
  Isolate *isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "world"));
}

void Init(Local<Object> exports)
{
  NODE_SET_METHOD(exports, "hello", Method);
}

NODE_MODULE(addon, Init)
