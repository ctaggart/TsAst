#![allow(non_snake_case)]
#![allow(unused_imports)]
#[macro_use]

extern crate neon;

// use neon::vm::{Call, JsResult, JsNumber, JsValue, JsFunction};
// use neon::js::JsString;

use neon::vm::{Call, JsResult, This, FunctionCall};
use neon::mem::Handle;
use neon::js::{JsNumber, JsNull, JsFunction, Object, JsValue, JsUndefined, JsString, Value};

fn hello(call: Call) -> JsResult<JsString> {
    let scope = call.scope;
    Ok(JsString::new(scope, "hello node").unwrap())
}

// https://github.com/neon-bindings/neon/blob/master/tests/native/src/js/functions.rs
fn getYear(call: Call) -> JsResult<JsNumber> {
    let scope = call.scope;
    let f = try!(try!(call.arguments.require(scope, 0)).check::<JsFunction>());
    let zero = JsNumber::new(scope, 0.0);
    let o = try!(f.construct(scope, vec![zero]));
    let get_utc_full_year_method = try!(try!(o.get(scope, "getUTCFullYear")).check::<JsFunction>());
    let args: Vec<Handle<JsValue>> = vec![];
    try!(get_utc_full_year_method.call(scope, o.upcast::<JsValue>(), args)).check::<JsNumber>()
}

// return constant from other module
fn tsVersion(call: Call) -> JsResult<JsNumber> {
    let scope = call.scope;

    let f = try!(try!(call.arguments.require(scope, 0)).check::<JsFunction>());
    let zero = JsNumber::new(scope, 0.0);
    let o = try!(f.construct(scope, vec![zero]));
    let get_utc_full_year_method = try!(try!(o.get(scope, "getUTCFullYear")).check::<JsFunction>());
    let args: Vec<Handle<JsValue>> = vec![];
    try!(get_utc_full_year_method.call(scope, o.upcast::<JsValue>(), args)).check::<JsNumber>()

    // let version = try!(try!(o.get(scope, "ts.version")).check::<JsString>());
    // Ok(version)
}

register_module!(m, {
    try!(m.export("hello", hello));
    try!(m.export("getYear", getYear));
    try!(m.export("tsVersion", tsVersion));
    Ok(())
});
