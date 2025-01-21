var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// node_modules/reflect-metadata/Reflect.js
var require_Reflect = __commonJS(() => {
  /*! *****************************************************************************
  Copyright (C) Microsoft. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var Reflect2;
  (function(Reflect3) {
    (function(factory) {
      var root = typeof globalThis === "object" ? globalThis : typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : sloppyModeThis();
      var exporter = makeExporter(Reflect3);
      if (typeof root.Reflect !== "undefined") {
        exporter = makeExporter(root.Reflect, exporter);
      }
      factory(exporter, root);
      if (typeof root.Reflect === "undefined") {
        root.Reflect = Reflect3;
      }
      function makeExporter(target, previous) {
        return function(key, value) {
          Object.defineProperty(target, key, { configurable: true, writable: true, value });
          if (previous)
            previous(key, value);
        };
      }
      function functionThis() {
        try {
          return Function("return this;")();
        } catch (_) {
        }
      }
      function indirectEvalThis() {
        try {
          return (undefined, eval)("(function() { return this; })()");
        } catch (_) {
        }
      }
      function sloppyModeThis() {
        return functionThis() || indirectEvalThis();
      }
    })(function(exporter, root) {
      var hasOwn = Object.prototype.hasOwnProperty;
      var supportsSymbol = typeof Symbol === "function";
      var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
      var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
      var supportsCreate = typeof Object.create === "function";
      var supportsProto = { __proto__: [] } instanceof Array;
      var downLevel = !supportsCreate && !supportsProto;
      var HashMap = {
        create: supportsCreate ? function() {
          return MakeDictionary(Object.create(null));
        } : supportsProto ? function() {
          return MakeDictionary({ __proto__: null });
        } : function() {
          return MakeDictionary({});
        },
        has: downLevel ? function(map, key) {
          return hasOwn.call(map, key);
        } : function(map, key) {
          return key in map;
        },
        get: downLevel ? function(map, key) {
          return hasOwn.call(map, key) ? map[key] : undefined;
        } : function(map, key) {
          return map[key];
        }
      };
      var functionPrototype = Object.getPrototypeOf(Function);
      var _Map = typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
      var _Set = typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
      var _WeakMap = typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
      var registrySymbol = supportsSymbol ? Symbol.for("@reflect-metadata:registry") : undefined;
      var metadataRegistry = GetOrCreateMetadataRegistry();
      var metadataProvider = CreateMetadataProvider(metadataRegistry);
      function decorate(decorators, target, propertyKey, attributes) {
        if (!IsUndefined(propertyKey)) {
          if (!IsArray(decorators))
            throw new TypeError;
          if (!IsObject(target))
            throw new TypeError;
          if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
            throw new TypeError;
          if (IsNull(attributes))
            attributes = undefined;
          propertyKey = ToPropertyKey(propertyKey);
          return DecorateProperty(decorators, target, propertyKey, attributes);
        } else {
          if (!IsArray(decorators))
            throw new TypeError;
          if (!IsConstructor(target))
            throw new TypeError;
          return DecorateConstructor(decorators, target);
        }
      }
      exporter("decorate", decorate);
      function metadata(metadataKey, metadataValue) {
        function decorator(target, propertyKey) {
          if (!IsObject(target))
            throw new TypeError;
          if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
            throw new TypeError;
          OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        return decorator;
      }
      exporter("metadata", metadata);
      function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError;
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
      }
      exporter("defineMetadata", defineMetadata);
      function hasMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError;
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasMetadata(metadataKey, target, propertyKey);
      }
      exporter("hasMetadata", hasMetadata);
      function hasOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError;
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
      }
      exporter("hasOwnMetadata", hasOwnMetadata);
      function getMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError;
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetMetadata(metadataKey, target, propertyKey);
      }
      exporter("getMetadata", getMetadata);
      function getOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError;
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
      }
      exporter("getOwnMetadata", getOwnMetadata);
      function getMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError;
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryMetadataKeys(target, propertyKey);
      }
      exporter("getMetadataKeys", getMetadataKeys);
      function getOwnMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError;
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryOwnMetadataKeys(target, propertyKey);
      }
      exporter("getOwnMetadataKeys", getOwnMetadataKeys);
      function deleteMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError;
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        if (!IsObject(target))
          throw new TypeError;
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        var provider = GetMetadataProvider(target, propertyKey, false);
        if (IsUndefined(provider))
          return false;
        return provider.OrdinaryDeleteMetadata(metadataKey, target, propertyKey);
      }
      exporter("deleteMetadata", deleteMetadata);
      function DecorateConstructor(decorators, target) {
        for (var i = decorators.length - 1;i >= 0; --i) {
          var decorator = decorators[i];
          var decorated = decorator(target);
          if (!IsUndefined(decorated) && !IsNull(decorated)) {
            if (!IsConstructor(decorated))
              throw new TypeError;
            target = decorated;
          }
        }
        return target;
      }
      function DecorateProperty(decorators, target, propertyKey, descriptor) {
        for (var i = decorators.length - 1;i >= 0; --i) {
          var decorator = decorators[i];
          var decorated = decorator(target, propertyKey, descriptor);
          if (!IsUndefined(decorated) && !IsNull(decorated)) {
            if (!IsObject(decorated))
              throw new TypeError;
            descriptor = decorated;
          }
        }
        return descriptor;
      }
      function OrdinaryHasMetadata(MetadataKey, O, P) {
        var hasOwn2 = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn2)
          return true;
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
          return OrdinaryHasMetadata(MetadataKey, parent, P);
        return false;
      }
      function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
        var provider = GetMetadataProvider(O, P, false);
        if (IsUndefined(provider))
          return false;
        return ToBoolean(provider.OrdinaryHasOwnMetadata(MetadataKey, O, P));
      }
      function OrdinaryGetMetadata(MetadataKey, O, P) {
        var hasOwn2 = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn2)
          return OrdinaryGetOwnMetadata(MetadataKey, O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
          return OrdinaryGetMetadata(MetadataKey, parent, P);
        return;
      }
      function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
        var provider = GetMetadataProvider(O, P, false);
        if (IsUndefined(provider))
          return;
        return provider.OrdinaryGetOwnMetadata(MetadataKey, O, P);
      }
      function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
        var provider = GetMetadataProvider(O, P, true);
        provider.OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P);
      }
      function OrdinaryMetadataKeys(O, P) {
        var ownKeys = OrdinaryOwnMetadataKeys(O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (parent === null)
          return ownKeys;
        var parentKeys = OrdinaryMetadataKeys(parent, P);
        if (parentKeys.length <= 0)
          return ownKeys;
        if (ownKeys.length <= 0)
          return parentKeys;
        var set = new _Set;
        var keys = [];
        for (var _i = 0, ownKeys_1 = ownKeys;_i < ownKeys_1.length; _i++) {
          var key = ownKeys_1[_i];
          var hasKey = set.has(key);
          if (!hasKey) {
            set.add(key);
            keys.push(key);
          }
        }
        for (var _a = 0, parentKeys_1 = parentKeys;_a < parentKeys_1.length; _a++) {
          var key = parentKeys_1[_a];
          var hasKey = set.has(key);
          if (!hasKey) {
            set.add(key);
            keys.push(key);
          }
        }
        return keys;
      }
      function OrdinaryOwnMetadataKeys(O, P) {
        var provider = GetMetadataProvider(O, P, false);
        if (!provider) {
          return [];
        }
        return provider.OrdinaryOwnMetadataKeys(O, P);
      }
      function Type(x) {
        if (x === null)
          return 1;
        switch (typeof x) {
          case "undefined":
            return 0;
          case "boolean":
            return 2;
          case "string":
            return 3;
          case "symbol":
            return 4;
          case "number":
            return 5;
          case "object":
            return x === null ? 1 : 6;
          default:
            return 6;
        }
      }
      function IsUndefined(x) {
        return x === undefined;
      }
      function IsNull(x) {
        return x === null;
      }
      function IsSymbol(x) {
        return typeof x === "symbol";
      }
      function IsObject(x) {
        return typeof x === "object" ? x !== null : typeof x === "function";
      }
      function ToPrimitive(input, PreferredType) {
        switch (Type(input)) {
          case 0:
            return input;
          case 1:
            return input;
          case 2:
            return input;
          case 3:
            return input;
          case 4:
            return input;
          case 5:
            return input;
        }
        var hint = PreferredType === 3 ? "string" : PreferredType === 5 ? "number" : "default";
        var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
        if (exoticToPrim !== undefined) {
          var result = exoticToPrim.call(input, hint);
          if (IsObject(result))
            throw new TypeError;
          return result;
        }
        return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
      }
      function OrdinaryToPrimitive(O, hint) {
        if (hint === "string") {
          var toString_1 = O.toString;
          if (IsCallable(toString_1)) {
            var result = toString_1.call(O);
            if (!IsObject(result))
              return result;
          }
          var valueOf = O.valueOf;
          if (IsCallable(valueOf)) {
            var result = valueOf.call(O);
            if (!IsObject(result))
              return result;
          }
        } else {
          var valueOf = O.valueOf;
          if (IsCallable(valueOf)) {
            var result = valueOf.call(O);
            if (!IsObject(result))
              return result;
          }
          var toString_2 = O.toString;
          if (IsCallable(toString_2)) {
            var result = toString_2.call(O);
            if (!IsObject(result))
              return result;
          }
        }
        throw new TypeError;
      }
      function ToBoolean(argument) {
        return !!argument;
      }
      function ToString(argument) {
        return "" + argument;
      }
      function ToPropertyKey(argument) {
        var key = ToPrimitive(argument, 3);
        if (IsSymbol(key))
          return key;
        return ToString(key);
      }
      function IsArray(argument) {
        return Array.isArray ? Array.isArray(argument) : argument instanceof Object ? argument instanceof Array : Object.prototype.toString.call(argument) === "[object Array]";
      }
      function IsCallable(argument) {
        return typeof argument === "function";
      }
      function IsConstructor(argument) {
        return typeof argument === "function";
      }
      function IsPropertyKey(argument) {
        switch (Type(argument)) {
          case 3:
            return true;
          case 4:
            return true;
          default:
            return false;
        }
      }
      function SameValueZero(x, y) {
        return x === y || x !== x && y !== y;
      }
      function GetMethod(V, P) {
        var func = V[P];
        if (func === undefined || func === null)
          return;
        if (!IsCallable(func))
          throw new TypeError;
        return func;
      }
      function GetIterator(obj) {
        var method = GetMethod(obj, iteratorSymbol);
        if (!IsCallable(method))
          throw new TypeError;
        var iterator = method.call(obj);
        if (!IsObject(iterator))
          throw new TypeError;
        return iterator;
      }
      function IteratorValue(iterResult) {
        return iterResult.value;
      }
      function IteratorStep(iterator) {
        var result = iterator.next();
        return result.done ? false : result;
      }
      function IteratorClose(iterator) {
        var f = iterator["return"];
        if (f)
          f.call(iterator);
      }
      function OrdinaryGetPrototypeOf(O) {
        var proto = Object.getPrototypeOf(O);
        if (typeof O !== "function" || O === functionPrototype)
          return proto;
        if (proto !== functionPrototype)
          return proto;
        var prototype = O.prototype;
        var prototypeProto = prototype && Object.getPrototypeOf(prototype);
        if (prototypeProto == null || prototypeProto === Object.prototype)
          return proto;
        var constructor = prototypeProto.constructor;
        if (typeof constructor !== "function")
          return proto;
        if (constructor === O)
          return proto;
        return constructor;
      }
      function CreateMetadataRegistry() {
        var fallback;
        if (!IsUndefined(registrySymbol) && typeof root.Reflect !== "undefined" && !(registrySymbol in root.Reflect) && typeof root.Reflect.defineMetadata === "function") {
          fallback = CreateFallbackProvider(root.Reflect);
        }
        var first;
        var second;
        var rest;
        var targetProviderMap = new _WeakMap;
        var registry = {
          registerProvider,
          getProvider,
          setProvider
        };
        return registry;
        function registerProvider(provider) {
          if (!Object.isExtensible(registry)) {
            throw new Error("Cannot add provider to a frozen registry.");
          }
          switch (true) {
            case fallback === provider:
              break;
            case IsUndefined(first):
              first = provider;
              break;
            case first === provider:
              break;
            case IsUndefined(second):
              second = provider;
              break;
            case second === provider:
              break;
            default:
              if (rest === undefined)
                rest = new _Set;
              rest.add(provider);
              break;
          }
        }
        function getProviderNoCache(O, P) {
          if (!IsUndefined(first)) {
            if (first.isProviderFor(O, P))
              return first;
            if (!IsUndefined(second)) {
              if (second.isProviderFor(O, P))
                return first;
              if (!IsUndefined(rest)) {
                var iterator = GetIterator(rest);
                while (true) {
                  var next = IteratorStep(iterator);
                  if (!next) {
                    return;
                  }
                  var provider = IteratorValue(next);
                  if (provider.isProviderFor(O, P)) {
                    IteratorClose(iterator);
                    return provider;
                  }
                }
              }
            }
          }
          if (!IsUndefined(fallback) && fallback.isProviderFor(O, P)) {
            return fallback;
          }
          return;
        }
        function getProvider(O, P) {
          var providerMap = targetProviderMap.get(O);
          var provider;
          if (!IsUndefined(providerMap)) {
            provider = providerMap.get(P);
          }
          if (!IsUndefined(provider)) {
            return provider;
          }
          provider = getProviderNoCache(O, P);
          if (!IsUndefined(provider)) {
            if (IsUndefined(providerMap)) {
              providerMap = new _Map;
              targetProviderMap.set(O, providerMap);
            }
            providerMap.set(P, provider);
          }
          return provider;
        }
        function hasProvider(provider) {
          if (IsUndefined(provider))
            throw new TypeError;
          return first === provider || second === provider || !IsUndefined(rest) && rest.has(provider);
        }
        function setProvider(O, P, provider) {
          if (!hasProvider(provider)) {
            throw new Error("Metadata provider not registered.");
          }
          var existingProvider = getProvider(O, P);
          if (existingProvider !== provider) {
            if (!IsUndefined(existingProvider)) {
              return false;
            }
            var providerMap = targetProviderMap.get(O);
            if (IsUndefined(providerMap)) {
              providerMap = new _Map;
              targetProviderMap.set(O, providerMap);
            }
            providerMap.set(P, provider);
          }
          return true;
        }
      }
      function GetOrCreateMetadataRegistry() {
        var metadataRegistry2;
        if (!IsUndefined(registrySymbol) && IsObject(root.Reflect) && Object.isExtensible(root.Reflect)) {
          metadataRegistry2 = root.Reflect[registrySymbol];
        }
        if (IsUndefined(metadataRegistry2)) {
          metadataRegistry2 = CreateMetadataRegistry();
        }
        if (!IsUndefined(registrySymbol) && IsObject(root.Reflect) && Object.isExtensible(root.Reflect)) {
          Object.defineProperty(root.Reflect, registrySymbol, {
            enumerable: false,
            configurable: false,
            writable: false,
            value: metadataRegistry2
          });
        }
        return metadataRegistry2;
      }
      function CreateMetadataProvider(registry) {
        var metadata2 = new _WeakMap;
        var provider = {
          isProviderFor: function(O, P) {
            var targetMetadata = metadata2.get(O);
            if (IsUndefined(targetMetadata))
              return false;
            return targetMetadata.has(P);
          },
          OrdinaryDefineOwnMetadata: OrdinaryDefineOwnMetadata2,
          OrdinaryHasOwnMetadata: OrdinaryHasOwnMetadata2,
          OrdinaryGetOwnMetadata: OrdinaryGetOwnMetadata2,
          OrdinaryOwnMetadataKeys: OrdinaryOwnMetadataKeys2,
          OrdinaryDeleteMetadata
        };
        metadataRegistry.registerProvider(provider);
        return provider;
        function GetOrCreateMetadataMap(O, P, Create) {
          var targetMetadata = metadata2.get(O);
          var createdTargetMetadata = false;
          if (IsUndefined(targetMetadata)) {
            if (!Create)
              return;
            targetMetadata = new _Map;
            metadata2.set(O, targetMetadata);
            createdTargetMetadata = true;
          }
          var metadataMap = targetMetadata.get(P);
          if (IsUndefined(metadataMap)) {
            if (!Create)
              return;
            metadataMap = new _Map;
            targetMetadata.set(P, metadataMap);
            if (!registry.setProvider(O, P, provider)) {
              targetMetadata.delete(P);
              if (createdTargetMetadata) {
                metadata2.delete(O);
              }
              throw new Error("Wrong provider for target.");
            }
          }
          return metadataMap;
        }
        function OrdinaryHasOwnMetadata2(MetadataKey, O, P) {
          var metadataMap = GetOrCreateMetadataMap(O, P, false);
          if (IsUndefined(metadataMap))
            return false;
          return ToBoolean(metadataMap.has(MetadataKey));
        }
        function OrdinaryGetOwnMetadata2(MetadataKey, O, P) {
          var metadataMap = GetOrCreateMetadataMap(O, P, false);
          if (IsUndefined(metadataMap))
            return;
          return metadataMap.get(MetadataKey);
        }
        function OrdinaryDefineOwnMetadata2(MetadataKey, MetadataValue, O, P) {
          var metadataMap = GetOrCreateMetadataMap(O, P, true);
          metadataMap.set(MetadataKey, MetadataValue);
        }
        function OrdinaryOwnMetadataKeys2(O, P) {
          var keys = [];
          var metadataMap = GetOrCreateMetadataMap(O, P, false);
          if (IsUndefined(metadataMap))
            return keys;
          var keysObj = metadataMap.keys();
          var iterator = GetIterator(keysObj);
          var k = 0;
          while (true) {
            var next = IteratorStep(iterator);
            if (!next) {
              keys.length = k;
              return keys;
            }
            var nextValue = IteratorValue(next);
            try {
              keys[k] = nextValue;
            } catch (e) {
              try {
                IteratorClose(iterator);
              } finally {
                throw e;
              }
            }
            k++;
          }
        }
        function OrdinaryDeleteMetadata(MetadataKey, O, P) {
          var metadataMap = GetOrCreateMetadataMap(O, P, false);
          if (IsUndefined(metadataMap))
            return false;
          if (!metadataMap.delete(MetadataKey))
            return false;
          if (metadataMap.size === 0) {
            var targetMetadata = metadata2.get(O);
            if (!IsUndefined(targetMetadata)) {
              targetMetadata.delete(P);
              if (targetMetadata.size === 0) {
                metadata2.delete(targetMetadata);
              }
            }
          }
          return true;
        }
      }
      function CreateFallbackProvider(reflect) {
        var { defineMetadata: defineMetadata2, hasOwnMetadata: hasOwnMetadata2, getOwnMetadata: getOwnMetadata2, getOwnMetadataKeys: getOwnMetadataKeys2, deleteMetadata: deleteMetadata2 } = reflect;
        var metadataOwner = new _WeakMap;
        var provider = {
          isProviderFor: function(O, P) {
            var metadataPropertySet = metadataOwner.get(O);
            if (!IsUndefined(metadataPropertySet) && metadataPropertySet.has(P)) {
              return true;
            }
            if (getOwnMetadataKeys2(O, P).length) {
              if (IsUndefined(metadataPropertySet)) {
                metadataPropertySet = new _Set;
                metadataOwner.set(O, metadataPropertySet);
              }
              metadataPropertySet.add(P);
              return true;
            }
            return false;
          },
          OrdinaryDefineOwnMetadata: defineMetadata2,
          OrdinaryHasOwnMetadata: hasOwnMetadata2,
          OrdinaryGetOwnMetadata: getOwnMetadata2,
          OrdinaryOwnMetadataKeys: getOwnMetadataKeys2,
          OrdinaryDeleteMetadata: deleteMetadata2
        };
        return provider;
      }
      function GetMetadataProvider(O, P, Create) {
        var registeredProvider = metadataRegistry.getProvider(O, P);
        if (!IsUndefined(registeredProvider)) {
          return registeredProvider;
        }
        if (Create) {
          if (metadataRegistry.setProvider(O, P, metadataProvider)) {
            return metadataProvider;
          }
          throw new Error("Illegal state.");
        }
        return;
      }
      function CreateMapPolyfill() {
        var cacheSentinel = {};
        var arraySentinel = [];
        var MapIterator = function() {
          function MapIterator2(keys, values, selector) {
            this._index = 0;
            this._keys = keys;
            this._values = values;
            this._selector = selector;
          }
          MapIterator2.prototype["@@iterator"] = function() {
            return this;
          };
          MapIterator2.prototype[iteratorSymbol] = function() {
            return this;
          };
          MapIterator2.prototype.next = function() {
            var index = this._index;
            if (index >= 0 && index < this._keys.length) {
              var result = this._selector(this._keys[index], this._values[index]);
              if (index + 1 >= this._keys.length) {
                this._index = -1;
                this._keys = arraySentinel;
                this._values = arraySentinel;
              } else {
                this._index++;
              }
              return { value: result, done: false };
            }
            return { value: undefined, done: true };
          };
          MapIterator2.prototype.throw = function(error) {
            if (this._index >= 0) {
              this._index = -1;
              this._keys = arraySentinel;
              this._values = arraySentinel;
            }
            throw error;
          };
          MapIterator2.prototype.return = function(value) {
            if (this._index >= 0) {
              this._index = -1;
              this._keys = arraySentinel;
              this._values = arraySentinel;
            }
            return { value, done: true };
          };
          return MapIterator2;
        }();
        var Map2 = function() {
          function Map3() {
            this._keys = [];
            this._values = [];
            this._cacheKey = cacheSentinel;
            this._cacheIndex = -2;
          }
          Object.defineProperty(Map3.prototype, "size", {
            get: function() {
              return this._keys.length;
            },
            enumerable: true,
            configurable: true
          });
          Map3.prototype.has = function(key) {
            return this._find(key, false) >= 0;
          };
          Map3.prototype.get = function(key) {
            var index = this._find(key, false);
            return index >= 0 ? this._values[index] : undefined;
          };
          Map3.prototype.set = function(key, value) {
            var index = this._find(key, true);
            this._values[index] = value;
            return this;
          };
          Map3.prototype.delete = function(key) {
            var index = this._find(key, false);
            if (index >= 0) {
              var size = this._keys.length;
              for (var i = index + 1;i < size; i++) {
                this._keys[i - 1] = this._keys[i];
                this._values[i - 1] = this._values[i];
              }
              this._keys.length--;
              this._values.length--;
              if (SameValueZero(key, this._cacheKey)) {
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
              }
              return true;
            }
            return false;
          };
          Map3.prototype.clear = function() {
            this._keys.length = 0;
            this._values.length = 0;
            this._cacheKey = cacheSentinel;
            this._cacheIndex = -2;
          };
          Map3.prototype.keys = function() {
            return new MapIterator(this._keys, this._values, getKey);
          };
          Map3.prototype.values = function() {
            return new MapIterator(this._keys, this._values, getValue);
          };
          Map3.prototype.entries = function() {
            return new MapIterator(this._keys, this._values, getEntry);
          };
          Map3.prototype["@@iterator"] = function() {
            return this.entries();
          };
          Map3.prototype[iteratorSymbol] = function() {
            return this.entries();
          };
          Map3.prototype._find = function(key, insert) {
            if (!SameValueZero(this._cacheKey, key)) {
              this._cacheIndex = -1;
              for (var i = 0;i < this._keys.length; i++) {
                if (SameValueZero(this._keys[i], key)) {
                  this._cacheIndex = i;
                  break;
                }
              }
            }
            if (this._cacheIndex < 0 && insert) {
              this._cacheIndex = this._keys.length;
              this._keys.push(key);
              this._values.push(undefined);
            }
            return this._cacheIndex;
          };
          return Map3;
        }();
        return Map2;
        function getKey(key, _) {
          return key;
        }
        function getValue(_, value) {
          return value;
        }
        function getEntry(key, value) {
          return [key, value];
        }
      }
      function CreateSetPolyfill() {
        var Set2 = function() {
          function Set3() {
            this._map = new _Map;
          }
          Object.defineProperty(Set3.prototype, "size", {
            get: function() {
              return this._map.size;
            },
            enumerable: true,
            configurable: true
          });
          Set3.prototype.has = function(value) {
            return this._map.has(value);
          };
          Set3.prototype.add = function(value) {
            return this._map.set(value, value), this;
          };
          Set3.prototype.delete = function(value) {
            return this._map.delete(value);
          };
          Set3.prototype.clear = function() {
            this._map.clear();
          };
          Set3.prototype.keys = function() {
            return this._map.keys();
          };
          Set3.prototype.values = function() {
            return this._map.keys();
          };
          Set3.prototype.entries = function() {
            return this._map.entries();
          };
          Set3.prototype["@@iterator"] = function() {
            return this.keys();
          };
          Set3.prototype[iteratorSymbol] = function() {
            return this.keys();
          };
          return Set3;
        }();
        return Set2;
      }
      function CreateWeakMapPolyfill() {
        var UUID_SIZE = 16;
        var keys = HashMap.create();
        var rootKey = CreateUniqueKey();
        return function() {
          function WeakMap2() {
            this._key = CreateUniqueKey();
          }
          WeakMap2.prototype.has = function(target) {
            var table = GetOrCreateWeakMapTable(target, false);
            return table !== undefined ? HashMap.has(table, this._key) : false;
          };
          WeakMap2.prototype.get = function(target) {
            var table = GetOrCreateWeakMapTable(target, false);
            return table !== undefined ? HashMap.get(table, this._key) : undefined;
          };
          WeakMap2.prototype.set = function(target, value) {
            var table = GetOrCreateWeakMapTable(target, true);
            table[this._key] = value;
            return this;
          };
          WeakMap2.prototype.delete = function(target) {
            var table = GetOrCreateWeakMapTable(target, false);
            return table !== undefined ? delete table[this._key] : false;
          };
          WeakMap2.prototype.clear = function() {
            this._key = CreateUniqueKey();
          };
          return WeakMap2;
        }();
        function CreateUniqueKey() {
          var key;
          do
            key = "@@WeakMap@@" + CreateUUID();
          while (HashMap.has(keys, key));
          keys[key] = true;
          return key;
        }
        function GetOrCreateWeakMapTable(target, create) {
          if (!hasOwn.call(target, rootKey)) {
            if (!create)
              return;
            Object.defineProperty(target, rootKey, { value: HashMap.create() });
          }
          return target[rootKey];
        }
        function FillRandomBytes(buffer, size) {
          for (var i = 0;i < size; ++i)
            buffer[i] = Math.random() * 255 | 0;
          return buffer;
        }
        function GenRandomBytes(size) {
          if (typeof Uint8Array === "function") {
            var array = new Uint8Array(size);
            if (typeof crypto !== "undefined") {
              crypto.getRandomValues(array);
            } else if (typeof msCrypto !== "undefined") {
              msCrypto.getRandomValues(array);
            } else {
              FillRandomBytes(array, size);
            }
            return array;
          }
          return FillRandomBytes(new Array(size), size);
        }
        function CreateUUID() {
          var data = GenRandomBytes(UUID_SIZE);
          data[6] = data[6] & 79 | 64;
          data[8] = data[8] & 191 | 128;
          var result = "";
          for (var offset = 0;offset < UUID_SIZE; ++offset) {
            var byte = data[offset];
            if (offset === 4 || offset === 6 || offset === 8)
              result += "-";
            if (byte < 16)
              result += "0";
            result += byte.toString(16).toLowerCase();
          }
          return result;
        }
      }
      function MakeDictionary(obj) {
        obj.__ = undefined;
        delete obj.__;
        return obj;
      }
    });
  })(Reflect2 || (Reflect2 = {}));
});

// node_modules/es-errors/index.js
var require_es_errors = __commonJS((exports, module) => {
  module.exports = Error;
});

// node_modules/es-errors/eval.js
var require_eval = __commonJS((exports, module) => {
  module.exports = EvalError;
});

// node_modules/es-errors/range.js
var require_range = __commonJS((exports, module) => {
  module.exports = RangeError;
});

// node_modules/es-errors/ref.js
var require_ref = __commonJS((exports, module) => {
  module.exports = ReferenceError;
});

// node_modules/es-errors/syntax.js
var require_syntax = __commonJS((exports, module) => {
  module.exports = SyntaxError;
});

// node_modules/es-errors/type.js
var require_type = __commonJS((exports, module) => {
  module.exports = TypeError;
});

// node_modules/es-errors/uri.js
var require_uri = __commonJS((exports, module) => {
  module.exports = URIError;
});

// node_modules/has-symbols/shams.js
var require_shams = __commonJS((exports, module) => {
  module.exports = function hasSymbols() {
    if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
      return false;
    }
    if (typeof Symbol.iterator === "symbol") {
      return true;
    }
    var obj = {};
    var sym = Symbol("test");
    var symObj = Object(sym);
    if (typeof sym === "string") {
      return false;
    }
    if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
      return false;
    }
    if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
      return false;
    }
    var symVal = 42;
    obj[sym] = symVal;
    for (sym in obj) {
      return false;
    }
    if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
      return false;
    }
    if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
      return false;
    }
    var syms = Object.getOwnPropertySymbols(obj);
    if (syms.length !== 1 || syms[0] !== sym) {
      return false;
    }
    if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
      return false;
    }
    if (typeof Object.getOwnPropertyDescriptor === "function") {
      var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
      if (descriptor.value !== symVal || descriptor.enumerable !== true) {
        return false;
      }
    }
    return true;
  };
});

// node_modules/has-symbols/index.js
var require_has_symbols = __commonJS((exports, module) => {
  var origSymbol = typeof Symbol !== "undefined" && Symbol;
  var hasSymbolSham = require_shams();
  module.exports = function hasNativeSymbols() {
    if (typeof origSymbol !== "function") {
      return false;
    }
    if (typeof Symbol !== "function") {
      return false;
    }
    if (typeof origSymbol("foo") !== "symbol") {
      return false;
    }
    if (typeof Symbol("bar") !== "symbol") {
      return false;
    }
    return hasSymbolSham();
  };
});

// node_modules/has-proto/index.js
var require_has_proto = __commonJS((exports, module) => {
  var test = {
    __proto__: null,
    foo: {}
  };
  var $Object = Object;
  module.exports = function hasProto() {
    return { __proto__: test }.foo === test.foo && !(test instanceof $Object);
  };
});

// node_modules/function-bind/implementation.js
var require_implementation = __commonJS((exports, module) => {
  var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
  var toStr = Object.prototype.toString;
  var max = Math.max;
  var funcType = "[object Function]";
  var concatty = function concatty(a, b) {
    var arr = [];
    for (var i = 0;i < a.length; i += 1) {
      arr[i] = a[i];
    }
    for (var j = 0;j < b.length; j += 1) {
      arr[j + a.length] = b[j];
    }
    return arr;
  };
  var slicy = function slicy(arrLike, offset) {
    var arr = [];
    for (var i = offset || 0, j = 0;i < arrLike.length; i += 1, j += 1) {
      arr[j] = arrLike[i];
    }
    return arr;
  };
  var joiny = function(arr, joiner) {
    var str = "";
    for (var i = 0;i < arr.length; i += 1) {
      str += arr[i];
      if (i + 1 < arr.length) {
        str += joiner;
      }
    }
    return str;
  };
  module.exports = function bind(that) {
    var target = this;
    if (typeof target !== "function" || toStr.apply(target) !== funcType) {
      throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slicy(arguments, 1);
    var bound;
    var binder = function() {
      if (this instanceof bound) {
        var result = target.apply(this, concatty(args, arguments));
        if (Object(result) === result) {
          return result;
        }
        return this;
      }
      return target.apply(that, concatty(args, arguments));
    };
    var boundLength = max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0;i < boundLength; i++) {
      boundArgs[i] = "$" + i;
    }
    bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
    if (target.prototype) {
      var Empty = function Empty() {
      };
      Empty.prototype = target.prototype;
      bound.prototype = new Empty;
      Empty.prototype = null;
    }
    return bound;
  };
});

// node_modules/function-bind/index.js
var require_function_bind = __commonJS((exports, module) => {
  var implementation = require_implementation();
  module.exports = Function.prototype.bind || implementation;
});

// node_modules/hasown/index.js
var require_hasown = __commonJS((exports, module) => {
  var call = Function.prototype.call;
  var $hasOwn = Object.prototype.hasOwnProperty;
  var bind = require_function_bind();
  module.exports = bind.call(call, $hasOwn);
});

// node_modules/get-intrinsic/index.js
var require_get_intrinsic = __commonJS((exports, module) => {
  var undefined2;
  var $Error = require_es_errors();
  var $EvalError = require_eval();
  var $RangeError = require_range();
  var $ReferenceError = require_ref();
  var $SyntaxError = require_syntax();
  var $TypeError = require_type();
  var $URIError = require_uri();
  var $Function = Function;
  var getEvalledConstructor = function(expressionSyntax) {
    try {
      return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
    } catch (e) {
    }
  };
  var $gOPD = Object.getOwnPropertyDescriptor;
  if ($gOPD) {
    try {
      $gOPD({}, "");
    } catch (e) {
      $gOPD = null;
    }
  }
  var throwTypeError = function() {
    throw new $TypeError;
  };
  var ThrowTypeError = $gOPD ? function() {
    try {
      arguments.callee;
      return throwTypeError;
    } catch (calleeThrows) {
      try {
        return $gOPD(arguments, "callee").get;
      } catch (gOPDthrows) {
        return throwTypeError;
      }
    }
  }() : throwTypeError;
  var hasSymbols = require_has_symbols()();
  var hasProto = require_has_proto()();
  var getProto = Object.getPrototypeOf || (hasProto ? function(x) {
    return x.__proto__;
  } : null);
  var needsEval = {};
  var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined2 : getProto(Uint8Array);
  var INTRINSICS = {
    __proto__: null,
    "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
    "%Array%": Array,
    "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
    "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined2,
    "%AsyncFromSyncIteratorPrototype%": undefined2,
    "%AsyncFunction%": needsEval,
    "%AsyncGenerator%": needsEval,
    "%AsyncGeneratorFunction%": needsEval,
    "%AsyncIteratorPrototype%": needsEval,
    "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
    "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
    "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined2 : BigInt64Array,
    "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined2 : BigUint64Array,
    "%Boolean%": Boolean,
    "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
    "%Date%": Date,
    "%decodeURI%": decodeURI,
    "%decodeURIComponent%": decodeURIComponent,
    "%encodeURI%": encodeURI,
    "%encodeURIComponent%": encodeURIComponent,
    "%Error%": $Error,
    "%eval%": eval,
    "%EvalError%": $EvalError,
    "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
    "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
    "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
    "%Function%": $Function,
    "%GeneratorFunction%": needsEval,
    "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
    "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
    "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
    "%isFinite%": isFinite,
    "%isNaN%": isNaN,
    "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined2,
    "%JSON%": typeof JSON === "object" ? JSON : undefined2,
    "%Map%": typeof Map === "undefined" ? undefined2 : Map,
    "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto(new Map()[Symbol.iterator]()),
    "%Math%": Math,
    "%Number%": Number,
    "%Object%": Object,
    "%parseFloat%": parseFloat,
    "%parseInt%": parseInt,
    "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
    "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
    "%RangeError%": $RangeError,
    "%ReferenceError%": $ReferenceError,
    "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
    "%RegExp%": RegExp,
    "%Set%": typeof Set === "undefined" ? undefined2 : Set,
    "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto(new Set()[Symbol.iterator]()),
    "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
    "%String%": String,
    "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined2,
    "%Symbol%": hasSymbols ? Symbol : undefined2,
    "%SyntaxError%": $SyntaxError,
    "%ThrowTypeError%": ThrowTypeError,
    "%TypedArray%": TypedArray,
    "%TypeError%": $TypeError,
    "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
    "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
    "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
    "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
    "%URIError%": $URIError,
    "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
    "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
    "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet
  };
  if (getProto) {
    try {
      null.error;
    } catch (e) {
      errorProto = getProto(getProto(e));
      INTRINSICS["%Error.prototype%"] = errorProto;
    }
  }
  var errorProto;
  var doEval = function doEval(name) {
    var value;
    if (name === "%AsyncFunction%") {
      value = getEvalledConstructor("async function () {}");
    } else if (name === "%GeneratorFunction%") {
      value = getEvalledConstructor("function* () {}");
    } else if (name === "%AsyncGeneratorFunction%") {
      value = getEvalledConstructor("async function* () {}");
    } else if (name === "%AsyncGenerator%") {
      var fn = doEval("%AsyncGeneratorFunction%");
      if (fn) {
        value = fn.prototype;
      }
    } else if (name === "%AsyncIteratorPrototype%") {
      var gen = doEval("%AsyncGenerator%");
      if (gen && getProto) {
        value = getProto(gen.prototype);
      }
    }
    INTRINSICS[name] = value;
    return value;
  };
  var LEGACY_ALIASES = {
    __proto__: null,
    "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
    "%ArrayPrototype%": ["Array", "prototype"],
    "%ArrayProto_entries%": ["Array", "prototype", "entries"],
    "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
    "%ArrayProto_keys%": ["Array", "prototype", "keys"],
    "%ArrayProto_values%": ["Array", "prototype", "values"],
    "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
    "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
    "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
    "%BooleanPrototype%": ["Boolean", "prototype"],
    "%DataViewPrototype%": ["DataView", "prototype"],
    "%DatePrototype%": ["Date", "prototype"],
    "%ErrorPrototype%": ["Error", "prototype"],
    "%EvalErrorPrototype%": ["EvalError", "prototype"],
    "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
    "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
    "%FunctionPrototype%": ["Function", "prototype"],
    "%Generator%": ["GeneratorFunction", "prototype"],
    "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
    "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
    "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
    "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
    "%JSONParse%": ["JSON", "parse"],
    "%JSONStringify%": ["JSON", "stringify"],
    "%MapPrototype%": ["Map", "prototype"],
    "%NumberPrototype%": ["Number", "prototype"],
    "%ObjectPrototype%": ["Object", "prototype"],
    "%ObjProto_toString%": ["Object", "prototype", "toString"],
    "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
    "%PromisePrototype%": ["Promise", "prototype"],
    "%PromiseProto_then%": ["Promise", "prototype", "then"],
    "%Promise_all%": ["Promise", "all"],
    "%Promise_reject%": ["Promise", "reject"],
    "%Promise_resolve%": ["Promise", "resolve"],
    "%RangeErrorPrototype%": ["RangeError", "prototype"],
    "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
    "%RegExpPrototype%": ["RegExp", "prototype"],
    "%SetPrototype%": ["Set", "prototype"],
    "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
    "%StringPrototype%": ["String", "prototype"],
    "%SymbolPrototype%": ["Symbol", "prototype"],
    "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
    "%TypedArrayPrototype%": ["TypedArray", "prototype"],
    "%TypeErrorPrototype%": ["TypeError", "prototype"],
    "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
    "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
    "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
    "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
    "%URIErrorPrototype%": ["URIError", "prototype"],
    "%WeakMapPrototype%": ["WeakMap", "prototype"],
    "%WeakSetPrototype%": ["WeakSet", "prototype"]
  };
  var bind = require_function_bind();
  var hasOwn = require_hasown();
  var $concat = bind.call(Function.call, Array.prototype.concat);
  var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
  var $replace = bind.call(Function.call, String.prototype.replace);
  var $strSlice = bind.call(Function.call, String.prototype.slice);
  var $exec = bind.call(Function.call, RegExp.prototype.exec);
  var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
  var reEscapeChar = /\\(\\)?/g;
  var stringToPath = function stringToPath(string) {
    var first = $strSlice(string, 0, 1);
    var last = $strSlice(string, -1);
    if (first === "%" && last !== "%") {
      throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
    } else if (last === "%" && first !== "%") {
      throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
    }
    var result = [];
    $replace(string, rePropName, function(match, number, quote, subString) {
      result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
    });
    return result;
  };
  var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
    var intrinsicName = name;
    var alias;
    if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
      alias = LEGACY_ALIASES[intrinsicName];
      intrinsicName = "%" + alias[0] + "%";
    }
    if (hasOwn(INTRINSICS, intrinsicName)) {
      var value = INTRINSICS[intrinsicName];
      if (value === needsEval) {
        value = doEval(intrinsicName);
      }
      if (typeof value === "undefined" && !allowMissing) {
        throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
      }
      return {
        alias,
        name: intrinsicName,
        value
      };
    }
    throw new $SyntaxError("intrinsic " + name + " does not exist!");
  };
  module.exports = function GetIntrinsic(name, allowMissing) {
    if (typeof name !== "string" || name.length === 0) {
      throw new $TypeError("intrinsic name must be a non-empty string");
    }
    if (arguments.length > 1 && typeof allowMissing !== "boolean") {
      throw new $TypeError('"allowMissing" argument must be a boolean');
    }
    if ($exec(/^%?[^%]*%?$/, name) === null) {
      throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
    }
    var parts = stringToPath(name);
    var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
    var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
    var intrinsicRealName = intrinsic.name;
    var value = intrinsic.value;
    var skipFurtherCaching = false;
    var alias = intrinsic.alias;
    if (alias) {
      intrinsicBaseName = alias[0];
      $spliceApply(parts, $concat([0, 1], alias));
    }
    for (var i = 1, isOwn = true;i < parts.length; i += 1) {
      var part = parts[i];
      var first = $strSlice(part, 0, 1);
      var last = $strSlice(part, -1);
      if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
        throw new $SyntaxError("property names with quotes must have matching quotes");
      }
      if (part === "constructor" || !isOwn) {
        skipFurtherCaching = true;
      }
      intrinsicBaseName += "." + part;
      intrinsicRealName = "%" + intrinsicBaseName + "%";
      if (hasOwn(INTRINSICS, intrinsicRealName)) {
        value = INTRINSICS[intrinsicRealName];
      } else if (value != null) {
        if (!(part in value)) {
          if (!allowMissing) {
            throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
          }
          return;
        }
        if ($gOPD && i + 1 >= parts.length) {
          var desc = $gOPD(value, part);
          isOwn = !!desc;
          if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
            value = desc.get;
          } else {
            value = value[part];
          }
        } else {
          isOwn = hasOwn(value, part);
          value = value[part];
        }
        if (isOwn && !skipFurtherCaching) {
          INTRINSICS[intrinsicRealName] = value;
        }
      }
    }
    return value;
  };
});

// node_modules/es-define-property/index.js
var require_es_define_property = __commonJS((exports, module) => {
  var GetIntrinsic = require_get_intrinsic();
  var $defineProperty = GetIntrinsic("%Object.defineProperty%", true) || false;
  if ($defineProperty) {
    try {
      $defineProperty({}, "a", { value: 1 });
    } catch (e) {
      $defineProperty = false;
    }
  }
  module.exports = $defineProperty;
});

// node_modules/gopd/index.js
var require_gopd = __commonJS((exports, module) => {
  var GetIntrinsic = require_get_intrinsic();
  var $gOPD = GetIntrinsic("%Object.getOwnPropertyDescriptor%", true);
  if ($gOPD) {
    try {
      $gOPD([], "length");
    } catch (e) {
      $gOPD = null;
    }
  }
  module.exports = $gOPD;
});

// node_modules/define-data-property/index.js
var require_define_data_property = __commonJS((exports, module) => {
  var $defineProperty = require_es_define_property();
  var $SyntaxError = require_syntax();
  var $TypeError = require_type();
  var gopd = require_gopd();
  module.exports = function defineDataProperty(obj, property, value) {
    if (!obj || typeof obj !== "object" && typeof obj !== "function") {
      throw new $TypeError("`obj` must be an object or a function`");
    }
    if (typeof property !== "string" && typeof property !== "symbol") {
      throw new $TypeError("`property` must be a string or a symbol`");
    }
    if (arguments.length > 3 && typeof arguments[3] !== "boolean" && arguments[3] !== null) {
      throw new $TypeError("`nonEnumerable`, if provided, must be a boolean or null");
    }
    if (arguments.length > 4 && typeof arguments[4] !== "boolean" && arguments[4] !== null) {
      throw new $TypeError("`nonWritable`, if provided, must be a boolean or null");
    }
    if (arguments.length > 5 && typeof arguments[5] !== "boolean" && arguments[5] !== null) {
      throw new $TypeError("`nonConfigurable`, if provided, must be a boolean or null");
    }
    if (arguments.length > 6 && typeof arguments[6] !== "boolean") {
      throw new $TypeError("`loose`, if provided, must be a boolean");
    }
    var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
    var nonWritable = arguments.length > 4 ? arguments[4] : null;
    var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
    var loose = arguments.length > 6 ? arguments[6] : false;
    var desc = !!gopd && gopd(obj, property);
    if ($defineProperty) {
      $defineProperty(obj, property, {
        configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
        enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
        value,
        writable: nonWritable === null && desc ? desc.writable : !nonWritable
      });
    } else if (loose || !nonEnumerable && !nonWritable && !nonConfigurable) {
      obj[property] = value;
    } else {
      throw new $SyntaxError("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
    }
  };
});

// node_modules/has-property-descriptors/index.js
var require_has_property_descriptors = __commonJS((exports, module) => {
  var $defineProperty = require_es_define_property();
  var hasPropertyDescriptors = function hasPropertyDescriptors() {
    return !!$defineProperty;
  };
  hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
    if (!$defineProperty) {
      return null;
    }
    try {
      return $defineProperty([], "length", { value: 1 }).length !== 1;
    } catch (e) {
      return true;
    }
  };
  module.exports = hasPropertyDescriptors;
});

// node_modules/set-function-length/index.js
var require_set_function_length = __commonJS((exports, module) => {
  var GetIntrinsic = require_get_intrinsic();
  var define = require_define_data_property();
  var hasDescriptors = require_has_property_descriptors()();
  var gOPD = require_gopd();
  var $TypeError = require_type();
  var $floor = GetIntrinsic("%Math.floor%");
  module.exports = function setFunctionLength(fn, length) {
    if (typeof fn !== "function") {
      throw new $TypeError("`fn` is not a function");
    }
    if (typeof length !== "number" || length < 0 || length > 4294967295 || $floor(length) !== length) {
      throw new $TypeError("`length` must be a positive 32-bit integer");
    }
    var loose = arguments.length > 2 && !!arguments[2];
    var functionLengthIsConfigurable = true;
    var functionLengthIsWritable = true;
    if ("length" in fn && gOPD) {
      var desc = gOPD(fn, "length");
      if (desc && !desc.configurable) {
        functionLengthIsConfigurable = false;
      }
      if (desc && !desc.writable) {
        functionLengthIsWritable = false;
      }
    }
    if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
      if (hasDescriptors) {
        define(fn, "length", length, true, true);
      } else {
        define(fn, "length", length);
      }
    }
    return fn;
  };
});

// node_modules/call-bind/index.js
var require_call_bind = __commonJS((exports, module) => {
  var bind = require_function_bind();
  var GetIntrinsic = require_get_intrinsic();
  var setFunctionLength = require_set_function_length();
  var $TypeError = require_type();
  var $apply = GetIntrinsic("%Function.prototype.apply%");
  var $call = GetIntrinsic("%Function.prototype.call%");
  var $reflectApply = GetIntrinsic("%Reflect.apply%", true) || bind.call($call, $apply);
  var $defineProperty = require_es_define_property();
  var $max = GetIntrinsic("%Math.max%");
  module.exports = function callBind(originalFunction) {
    if (typeof originalFunction !== "function") {
      throw new $TypeError("a function is required");
    }
    var func = $reflectApply(bind, $call, arguments);
    return setFunctionLength(func, 1 + $max(0, originalFunction.length - (arguments.length - 1)), true);
  };
  var applyBind = function applyBind() {
    return $reflectApply(bind, $apply, arguments);
  };
  if ($defineProperty) {
    $defineProperty(module.exports, "apply", { value: applyBind });
  } else {
    module.exports.apply = applyBind;
  }
});

// node_modules/call-bind/callBound.js
var require_callBound = __commonJS((exports, module) => {
  var GetIntrinsic = require_get_intrinsic();
  var callBind = require_call_bind();
  var $indexOf = callBind(GetIntrinsic("String.prototype.indexOf"));
  module.exports = function callBoundIntrinsic(name, allowMissing) {
    var intrinsic = GetIntrinsic(name, !!allowMissing);
    if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
      return callBind(intrinsic);
    }
    return intrinsic;
  };
});

// node_modules/object-inspect/index.js
var require_object_inspect = __commonJS((exports, module) => {
  var hasMap = typeof Map === "function" && Map.prototype;
  var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
  var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
  var mapForEach = hasMap && Map.prototype.forEach;
  var hasSet = typeof Set === "function" && Set.prototype;
  var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
  var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
  var setForEach = hasSet && Set.prototype.forEach;
  var hasWeakMap = typeof WeakMap === "function" && WeakMap.prototype;
  var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
  var hasWeakSet = typeof WeakSet === "function" && WeakSet.prototype;
  var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
  var hasWeakRef = typeof WeakRef === "function" && WeakRef.prototype;
  var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
  var booleanValueOf = Boolean.prototype.valueOf;
  var objectToString = Object.prototype.toString;
  var functionToString = Function.prototype.toString;
  var $match = String.prototype.match;
  var $slice = String.prototype.slice;
  var $replace = String.prototype.replace;
  var $toUpperCase = String.prototype.toUpperCase;
  var $toLowerCase = String.prototype.toLowerCase;
  var $test = RegExp.prototype.test;
  var $concat = Array.prototype.concat;
  var $join = Array.prototype.join;
  var $arrSlice = Array.prototype.slice;
  var $floor = Math.floor;
  var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
  var gOPS = Object.getOwnPropertySymbols;
  var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
  var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
  var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
  var isEnumerable = Object.prototype.propertyIsEnumerable;
  var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
    return O.__proto__;
  } : null);
  function addNumericSeparator(num, str) {
    if (num === Infinity || num === -Infinity || num !== num || num && num > -1000 && num < 1000 || $test.call(/e/, str)) {
      return str;
    }
    var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
    if (typeof num === "number") {
      var int = num < 0 ? -$floor(-num) : $floor(num);
      if (int !== num) {
        var intStr = String(int);
        var dec = $slice.call(str, intStr.length + 1);
        return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
      }
    }
    return $replace.call(str, sepRegex, "$&_");
  }
  var utilInspect = (() => ({}));
  var inspectCustom = utilInspect.custom;
  var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
  module.exports = function inspect_(obj, options, depth, seen) {
    var opts = options || {};
    if (has(opts, "quoteStyle") && (opts.quoteStyle !== "single" && opts.quoteStyle !== "double")) {
      throw new TypeError('option "quoteStyle" must be "single" or "double"');
    }
    if (has(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
      throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
    }
    var customInspect = has(opts, "customInspect") ? opts.customInspect : true;
    if (typeof customInspect !== "boolean" && customInspect !== "symbol") {
      throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
    }
    if (has(opts, "indent") && opts.indent !== null && opts.indent !== "\t" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
      throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
    }
    if (has(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") {
      throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
    }
    var numericSeparator = opts.numericSeparator;
    if (typeof obj === "undefined") {
      return "undefined";
    }
    if (obj === null) {
      return "null";
    }
    if (typeof obj === "boolean") {
      return obj ? "true" : "false";
    }
    if (typeof obj === "string") {
      return inspectString(obj, opts);
    }
    if (typeof obj === "number") {
      if (obj === 0) {
        return Infinity / obj > 0 ? "0" : "-0";
      }
      var str = String(obj);
      return numericSeparator ? addNumericSeparator(obj, str) : str;
    }
    if (typeof obj === "bigint") {
      var bigIntStr = String(obj) + "n";
      return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
    }
    var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
    if (typeof depth === "undefined") {
      depth = 0;
    }
    if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") {
      return isArray(obj) ? "[Array]" : "[Object]";
    }
    var indent = getIndent(opts, depth);
    if (typeof seen === "undefined") {
      seen = [];
    } else if (indexOf(seen, obj) >= 0) {
      return "[Circular]";
    }
    function inspect(value, from, noIndent) {
      if (from) {
        seen = $arrSlice.call(seen);
        seen.push(from);
      }
      if (noIndent) {
        var newOpts = {
          depth: opts.depth
        };
        if (has(opts, "quoteStyle")) {
          newOpts.quoteStyle = opts.quoteStyle;
        }
        return inspect_(value, newOpts, depth + 1, seen);
      }
      return inspect_(value, opts, depth + 1, seen);
    }
    if (typeof obj === "function" && !isRegExp(obj)) {
      var name = nameOf(obj);
      var keys = arrObjKeys(obj, inspect);
      return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
    }
    if (isSymbol(obj)) {
      var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
      return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
    }
    if (isElement(obj)) {
      var s = "<" + $toLowerCase.call(String(obj.nodeName));
      var attrs = obj.attributes || [];
      for (var i = 0;i < attrs.length; i++) {
        s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
      }
      s += ">";
      if (obj.childNodes && obj.childNodes.length) {
        s += "...";
      }
      s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
      return s;
    }
    if (isArray(obj)) {
      if (obj.length === 0) {
        return "[]";
      }
      var xs = arrObjKeys(obj, inspect);
      if (indent && !singleLineValues(xs)) {
        return "[" + indentedJoin(xs, indent) + "]";
      }
      return "[ " + $join.call(xs, ", ") + " ]";
    }
    if (isError(obj)) {
      var parts = arrObjKeys(obj, inspect);
      if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) {
        return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect(obj.cause), parts), ", ") + " }";
      }
      if (parts.length === 0) {
        return "[" + String(obj) + "]";
      }
      return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
    }
    if (typeof obj === "object" && customInspect) {
      if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) {
        return utilInspect(obj, { depth: maxDepth - depth });
      } else if (customInspect !== "symbol" && typeof obj.inspect === "function") {
        return obj.inspect();
      }
    }
    if (isMap(obj)) {
      var mapParts = [];
      if (mapForEach) {
        mapForEach.call(obj, function(value, key) {
          mapParts.push(inspect(key, obj, true) + " => " + inspect(value, obj));
        });
      }
      return collectionOf("Map", mapSize.call(obj), mapParts, indent);
    }
    if (isSet(obj)) {
      var setParts = [];
      if (setForEach) {
        setForEach.call(obj, function(value) {
          setParts.push(inspect(value, obj));
        });
      }
      return collectionOf("Set", setSize.call(obj), setParts, indent);
    }
    if (isWeakMap(obj)) {
      return weakCollectionOf("WeakMap");
    }
    if (isWeakSet(obj)) {
      return weakCollectionOf("WeakSet");
    }
    if (isWeakRef(obj)) {
      return weakCollectionOf("WeakRef");
    }
    if (isNumber(obj)) {
      return markBoxed(inspect(Number(obj)));
    }
    if (isBigInt(obj)) {
      return markBoxed(inspect(bigIntValueOf.call(obj)));
    }
    if (isBoolean(obj)) {
      return markBoxed(booleanValueOf.call(obj));
    }
    if (isString(obj)) {
      return markBoxed(inspect(String(obj)));
    }
    if (typeof window !== "undefined" && obj === window) {
      return "{ [object Window] }";
    }
    if (obj === global) {
      return "{ [object globalThis] }";
    }
    if (!isDate(obj) && !isRegExp(obj)) {
      var ys = arrObjKeys(obj, inspect);
      var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
      var protoTag = obj instanceof Object ? "" : "null prototype";
      var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
      var constructorTag = isPlainObject || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "";
      var tag = constructorTag + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
      if (ys.length === 0) {
        return tag + "{}";
      }
      if (indent) {
        return tag + "{" + indentedJoin(ys, indent) + "}";
      }
      return tag + "{ " + $join.call(ys, ", ") + " }";
    }
    return String(obj);
  };
  function wrapQuotes(s, defaultStyle, opts) {
    var quoteChar = (opts.quoteStyle || defaultStyle) === "double" ? '"' : "'";
    return quoteChar + s + quoteChar;
  }
  function quote(s) {
    return $replace.call(String(s), /"/g, "&quot;");
  }
  function isArray(obj) {
    return toStr(obj) === "[object Array]" && (!toStringTag || !(typeof obj === "object" && (toStringTag in obj)));
  }
  function isDate(obj) {
    return toStr(obj) === "[object Date]" && (!toStringTag || !(typeof obj === "object" && (toStringTag in obj)));
  }
  function isRegExp(obj) {
    return toStr(obj) === "[object RegExp]" && (!toStringTag || !(typeof obj === "object" && (toStringTag in obj)));
  }
  function isError(obj) {
    return toStr(obj) === "[object Error]" && (!toStringTag || !(typeof obj === "object" && (toStringTag in obj)));
  }
  function isString(obj) {
    return toStr(obj) === "[object String]" && (!toStringTag || !(typeof obj === "object" && (toStringTag in obj)));
  }
  function isNumber(obj) {
    return toStr(obj) === "[object Number]" && (!toStringTag || !(typeof obj === "object" && (toStringTag in obj)));
  }
  function isBoolean(obj) {
    return toStr(obj) === "[object Boolean]" && (!toStringTag || !(typeof obj === "object" && (toStringTag in obj)));
  }
  function isSymbol(obj) {
    if (hasShammedSymbols) {
      return obj && typeof obj === "object" && obj instanceof Symbol;
    }
    if (typeof obj === "symbol") {
      return true;
    }
    if (!obj || typeof obj !== "object" || !symToString) {
      return false;
    }
    try {
      symToString.call(obj);
      return true;
    } catch (e) {
    }
    return false;
  }
  function isBigInt(obj) {
    if (!obj || typeof obj !== "object" || !bigIntValueOf) {
      return false;
    }
    try {
      bigIntValueOf.call(obj);
      return true;
    } catch (e) {
    }
    return false;
  }
  var hasOwn = Object.prototype.hasOwnProperty || function(key) {
    return key in this;
  };
  function has(obj, key) {
    return hasOwn.call(obj, key);
  }
  function toStr(obj) {
    return objectToString.call(obj);
  }
  function nameOf(f) {
    if (f.name) {
      return f.name;
    }
    var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
    if (m) {
      return m[1];
    }
    return null;
  }
  function indexOf(xs, x) {
    if (xs.indexOf) {
      return xs.indexOf(x);
    }
    for (var i = 0, l = xs.length;i < l; i++) {
      if (xs[i] === x) {
        return i;
      }
    }
    return -1;
  }
  function isMap(x) {
    if (!mapSize || !x || typeof x !== "object") {
      return false;
    }
    try {
      mapSize.call(x);
      try {
        setSize.call(x);
      } catch (s) {
        return true;
      }
      return x instanceof Map;
    } catch (e) {
    }
    return false;
  }
  function isWeakMap(x) {
    if (!weakMapHas || !x || typeof x !== "object") {
      return false;
    }
    try {
      weakMapHas.call(x, weakMapHas);
      try {
        weakSetHas.call(x, weakSetHas);
      } catch (s) {
        return true;
      }
      return x instanceof WeakMap;
    } catch (e) {
    }
    return false;
  }
  function isWeakRef(x) {
    if (!weakRefDeref || !x || typeof x !== "object") {
      return false;
    }
    try {
      weakRefDeref.call(x);
      return true;
    } catch (e) {
    }
    return false;
  }
  function isSet(x) {
    if (!setSize || !x || typeof x !== "object") {
      return false;
    }
    try {
      setSize.call(x);
      try {
        mapSize.call(x);
      } catch (m) {
        return true;
      }
      return x instanceof Set;
    } catch (e) {
    }
    return false;
  }
  function isWeakSet(x) {
    if (!weakSetHas || !x || typeof x !== "object") {
      return false;
    }
    try {
      weakSetHas.call(x, weakSetHas);
      try {
        weakMapHas.call(x, weakMapHas);
      } catch (s) {
        return true;
      }
      return x instanceof WeakSet;
    } catch (e) {
    }
    return false;
  }
  function isElement(x) {
    if (!x || typeof x !== "object") {
      return false;
    }
    if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) {
      return true;
    }
    return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
  }
  function inspectString(str, opts) {
    if (str.length > opts.maxStringLength) {
      var remaining = str.length - opts.maxStringLength;
      var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
      return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
    }
    var s = $replace.call($replace.call(str, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, lowbyte);
    return wrapQuotes(s, "single", opts);
  }
  function lowbyte(c) {
    var n = c.charCodeAt(0);
    var x = {
      8: "b",
      9: "t",
      10: "n",
      12: "f",
      13: "r"
    }[n];
    if (x) {
      return "\\" + x;
    }
    return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
  }
  function markBoxed(str) {
    return "Object(" + str + ")";
  }
  function weakCollectionOf(type) {
    return type + " { ? }";
  }
  function collectionOf(type, size, entries, indent) {
    var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
    return type + " (" + size + ") {" + joinedEntries + "}";
  }
  function singleLineValues(xs) {
    for (var i = 0;i < xs.length; i++) {
      if (indexOf(xs[i], `
`) >= 0) {
        return false;
      }
    }
    return true;
  }
  function getIndent(opts, depth) {
    var baseIndent;
    if (opts.indent === "\t") {
      baseIndent = "\t";
    } else if (typeof opts.indent === "number" && opts.indent > 0) {
      baseIndent = $join.call(Array(opts.indent + 1), " ");
    } else {
      return null;
    }
    return {
      base: baseIndent,
      prev: $join.call(Array(depth + 1), baseIndent)
    };
  }
  function indentedJoin(xs, indent) {
    if (xs.length === 0) {
      return "";
    }
    var lineJoiner = `
` + indent.prev + indent.base;
    return lineJoiner + $join.call(xs, "," + lineJoiner) + `
` + indent.prev;
  }
  function arrObjKeys(obj, inspect) {
    var isArr = isArray(obj);
    var xs = [];
    if (isArr) {
      xs.length = obj.length;
      for (var i = 0;i < obj.length; i++) {
        xs[i] = has(obj, i) ? inspect(obj[i], obj) : "";
      }
    }
    var syms = typeof gOPS === "function" ? gOPS(obj) : [];
    var symMap;
    if (hasShammedSymbols) {
      symMap = {};
      for (var k = 0;k < syms.length; k++) {
        symMap["$" + syms[k]] = syms[k];
      }
    }
    for (var key in obj) {
      if (!has(obj, key)) {
        continue;
      }
      if (isArr && String(Number(key)) === key && key < obj.length) {
        continue;
      }
      if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) {
        continue;
      } else if ($test.call(/[^\w$]/, key)) {
        xs.push(inspect(key, obj) + ": " + inspect(obj[key], obj));
      } else {
        xs.push(key + ": " + inspect(obj[key], obj));
      }
    }
    if (typeof gOPS === "function") {
      for (var j = 0;j < syms.length; j++) {
        if (isEnumerable.call(obj, syms[j])) {
          xs.push("[" + inspect(syms[j]) + "]: " + inspect(obj[syms[j]], obj));
        }
      }
    }
    return xs;
  }
});

// node_modules/side-channel/index.js
var require_side_channel = __commonJS((exports, module) => {
  var GetIntrinsic = require_get_intrinsic();
  var callBound = require_callBound();
  var inspect = require_object_inspect();
  var $TypeError = require_type();
  var $WeakMap = GetIntrinsic("%WeakMap%", true);
  var $Map = GetIntrinsic("%Map%", true);
  var $weakMapGet = callBound("WeakMap.prototype.get", true);
  var $weakMapSet = callBound("WeakMap.prototype.set", true);
  var $weakMapHas = callBound("WeakMap.prototype.has", true);
  var $mapGet = callBound("Map.prototype.get", true);
  var $mapSet = callBound("Map.prototype.set", true);
  var $mapHas = callBound("Map.prototype.has", true);
  var listGetNode = function(list, key) {
    var prev = list;
    var curr;
    for (;(curr = prev.next) !== null; prev = curr) {
      if (curr.key === key) {
        prev.next = curr.next;
        curr.next = list.next;
        list.next = curr;
        return curr;
      }
    }
  };
  var listGet = function(objects, key) {
    var node = listGetNode(objects, key);
    return node && node.value;
  };
  var listSet = function(objects, key, value) {
    var node = listGetNode(objects, key);
    if (node) {
      node.value = value;
    } else {
      objects.next = {
        key,
        next: objects.next,
        value
      };
    }
  };
  var listHas = function(objects, key) {
    return !!listGetNode(objects, key);
  };
  module.exports = function getSideChannel() {
    var $wm;
    var $m;
    var $o;
    var channel = {
      assert: function(key) {
        if (!channel.has(key)) {
          throw new $TypeError("Side channel does not contain " + inspect(key));
        }
      },
      get: function(key) {
        if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
          if ($wm) {
            return $weakMapGet($wm, key);
          }
        } else if ($Map) {
          if ($m) {
            return $mapGet($m, key);
          }
        } else {
          if ($o) {
            return listGet($o, key);
          }
        }
      },
      has: function(key) {
        if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
          if ($wm) {
            return $weakMapHas($wm, key);
          }
        } else if ($Map) {
          if ($m) {
            return $mapHas($m, key);
          }
        } else {
          if ($o) {
            return listHas($o, key);
          }
        }
        return false;
      },
      set: function(key, value) {
        if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
          if (!$wm) {
            $wm = new $WeakMap;
          }
          $weakMapSet($wm, key, value);
        } else if ($Map) {
          if (!$m) {
            $m = new $Map;
          }
          $mapSet($m, key, value);
        } else {
          if (!$o) {
            $o = { key: {}, next: null };
          }
          listSet($o, key, value);
        }
      }
    };
    return channel;
  };
});

// node_modules/qs/lib/formats.js
var require_formats = __commonJS((exports, module) => {
  var replace = String.prototype.replace;
  var percentTwenties = /%20/g;
  var Format = {
    RFC1738: "RFC1738",
    RFC3986: "RFC3986"
  };
  module.exports = {
    default: Format.RFC3986,
    formatters: {
      RFC1738: function(value) {
        return replace.call(value, percentTwenties, "+");
      },
      RFC3986: function(value) {
        return String(value);
      }
    },
    RFC1738: Format.RFC1738,
    RFC3986: Format.RFC3986
  };
});

// node_modules/qs/lib/utils.js
var require_utils = __commonJS((exports, module) => {
  var formats = require_formats();
  var has = Object.prototype.hasOwnProperty;
  var isArray = Array.isArray;
  var hexTable = function() {
    var array = [];
    for (var i = 0;i < 256; ++i) {
      array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
    }
    return array;
  }();
  var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
      var item = queue.pop();
      var obj = item.obj[item.prop];
      if (isArray(obj)) {
        var compacted = [];
        for (var j = 0;j < obj.length; ++j) {
          if (typeof obj[j] !== "undefined") {
            compacted.push(obj[j]);
          }
        }
        item.obj[item.prop] = compacted;
      }
    }
  };
  var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? { __proto__: null } : {};
    for (var i = 0;i < source.length; ++i) {
      if (typeof source[i] !== "undefined") {
        obj[i] = source[i];
      }
    }
    return obj;
  };
  var merge = function merge(target, source, options) {
    if (!source) {
      return target;
    }
    if (typeof source !== "object" && typeof source !== "function") {
      if (isArray(target)) {
        target.push(source);
      } else if (target && typeof target === "object") {
        if (options && (options.plainObjects || options.allowPrototypes) || !has.call(Object.prototype, source)) {
          target[source] = true;
        }
      } else {
        return [target, source];
      }
      return target;
    }
    if (!target || typeof target !== "object") {
      return [target].concat(source);
    }
    var mergeTarget = target;
    if (isArray(target) && !isArray(source)) {
      mergeTarget = arrayToObject(target, options);
    }
    if (isArray(target) && isArray(source)) {
      source.forEach(function(item, i) {
        if (has.call(target, i)) {
          var targetItem = target[i];
          if (targetItem && typeof targetItem === "object" && item && typeof item === "object") {
            target[i] = merge(targetItem, item, options);
          } else {
            target.push(item);
          }
        } else {
          target[i] = item;
        }
      });
      return target;
    }
    return Object.keys(source).reduce(function(acc, key) {
      var value = source[key];
      if (has.call(acc, key)) {
        acc[key] = merge(acc[key], value, options);
      } else {
        acc[key] = value;
      }
      return acc;
    }, mergeTarget);
  };
  var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function(acc, key) {
      acc[key] = source[key];
      return acc;
    }, target);
  };
  var decode = function(str, defaultDecoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, " ");
    if (charset === "iso-8859-1") {
      return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    try {
      return decodeURIComponent(strWithoutPlus);
    } catch (e) {
      return strWithoutPlus;
    }
  };
  var limit = 1024;
  var encode = function encode(str, defaultEncoder, charset, kind, format) {
    if (str.length === 0) {
      return str;
    }
    var string = str;
    if (typeof str === "symbol") {
      string = Symbol.prototype.toString.call(str);
    } else if (typeof str !== "string") {
      string = String(str);
    }
    if (charset === "iso-8859-1") {
      return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
        return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
      });
    }
    var out = "";
    for (var j = 0;j < string.length; j += limit) {
      var segment = string.length >= limit ? string.slice(j, j + limit) : string;
      var arr = [];
      for (var i = 0;i < segment.length; ++i) {
        var c = segment.charCodeAt(i);
        if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format === formats.RFC1738 && (c === 40 || c === 41)) {
          arr[arr.length] = segment.charAt(i);
          continue;
        }
        if (c < 128) {
          arr[arr.length] = hexTable[c];
          continue;
        }
        if (c < 2048) {
          arr[arr.length] = hexTable[192 | c >> 6] + hexTable[128 | c & 63];
          continue;
        }
        if (c < 55296 || c >= 57344) {
          arr[arr.length] = hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
          continue;
        }
        i += 1;
        c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i) & 1023);
        arr[arr.length] = hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
      }
      out += arr.join("");
    }
    return out;
  };
  var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: "o" }];
    var refs = [];
    for (var i = 0;i < queue.length; ++i) {
      var item = queue[i];
      var obj = item.obj[item.prop];
      var keys = Object.keys(obj);
      for (var j = 0;j < keys.length; ++j) {
        var key = keys[j];
        var val = obj[key];
        if (typeof val === "object" && val !== null && refs.indexOf(val) === -1) {
          queue.push({ obj, prop: key });
          refs.push(val);
        }
      }
    }
    compactQueue(queue);
    return value;
  };
  var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === "[object RegExp]";
  };
  var isBuffer = function isBuffer(obj) {
    if (!obj || typeof obj !== "object") {
      return false;
    }
    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
  };
  var combine = function combine(a, b) {
    return [].concat(a, b);
  };
  var maybeMap = function maybeMap(val, fn) {
    if (isArray(val)) {
      var mapped = [];
      for (var i = 0;i < val.length; i += 1) {
        mapped.push(fn(val[i]));
      }
      return mapped;
    }
    return fn(val);
  };
  module.exports = {
    arrayToObject,
    assign,
    combine,
    compact,
    decode,
    encode,
    isBuffer,
    isRegExp,
    maybeMap,
    merge
  };
});

// node_modules/qs/lib/stringify.js
var require_stringify = __commonJS((exports, module) => {
  var getSideChannel = require_side_channel();
  var utils = require_utils();
  var formats = require_formats();
  var has = Object.prototype.hasOwnProperty;
  var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
      return prefix + "[]";
    },
    comma: "comma",
    indices: function indices(prefix, key) {
      return prefix + "[" + key + "]";
    },
    repeat: function repeat(prefix) {
      return prefix;
    }
  };
  var isArray = Array.isArray;
  var push = Array.prototype.push;
  var pushToArray = function(arr, valueOrArray) {
    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
  };
  var toISO = Date.prototype.toISOString;
  var defaultFormat = formats["default"];
  var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    allowEmptyArrays: false,
    arrayFormat: "indices",
    charset: "utf-8",
    charsetSentinel: false,
    commaRoundTrip: false,
    delimiter: "&",
    encode: true,
    encodeDotInKeys: false,
    encoder: utils.encode,
    encodeValuesOnly: false,
    filter: undefined,
    format: defaultFormat,
    formatter: formats.formatters[defaultFormat],
    indices: false,
    serializeDate: function serializeDate(date) {
      return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
  };
  var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
    return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
  };
  var sentinel = {};
  var stringify = function stringify(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
    var obj = object;
    var tmpSc = sideChannel;
    var step = 0;
    var findFlag = false;
    while ((tmpSc = tmpSc.get(sentinel)) !== undefined && !findFlag) {
      var pos = tmpSc.get(object);
      step += 1;
      if (typeof pos !== "undefined") {
        if (pos === step) {
          throw new RangeError("Cyclic object value");
        } else {
          findFlag = true;
        }
      }
      if (typeof tmpSc.get(sentinel) === "undefined") {
        step = 0;
      }
    }
    if (typeof filter === "function") {
      obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
      obj = serializeDate(obj);
    } else if (generateArrayPrefix === "comma" && isArray(obj)) {
      obj = utils.maybeMap(obj, function(value2) {
        if (value2 instanceof Date) {
          return serializeDate(value2);
        }
        return value2;
      });
    }
    if (obj === null) {
      if (strictNullHandling) {
        return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, "key", format) : prefix;
      }
      obj = "";
    }
    if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
      if (encoder) {
        var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, "key", format);
        return [formatter(keyValue) + "=" + formatter(encoder(obj, defaults.encoder, charset, "value", format))];
      }
      return [formatter(prefix) + "=" + formatter(String(obj))];
    }
    var values = [];
    if (typeof obj === "undefined") {
      return values;
    }
    var objKeys;
    if (generateArrayPrefix === "comma" && isArray(obj)) {
      if (encodeValuesOnly && encoder) {
        obj = utils.maybeMap(obj, encoder);
      }
      objKeys = [{ value: obj.length > 0 ? obj.join(",") || null : undefined }];
    } else if (isArray(filter)) {
      objKeys = filter;
    } else {
      var keys = Object.keys(obj);
      objKeys = sort ? keys.sort(sort) : keys;
    }
    var encodedPrefix = encodeDotInKeys ? String(prefix).replace(/\./g, "%2E") : String(prefix);
    var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? encodedPrefix + "[]" : encodedPrefix;
    if (allowEmptyArrays && isArray(obj) && obj.length === 0) {
      return adjustedPrefix + "[]";
    }
    for (var j = 0;j < objKeys.length; ++j) {
      var key = objKeys[j];
      var value = typeof key === "object" && key && typeof key.value !== "undefined" ? key.value : obj[key];
      if (skipNulls && value === null) {
        continue;
      }
      var encodedKey = allowDots && encodeDotInKeys ? String(key).replace(/\./g, "%2E") : String(key);
      var keyPrefix = isArray(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjustedPrefix, encodedKey) : adjustedPrefix : adjustedPrefix + (allowDots ? "." + encodedKey : "[" + encodedKey + "]");
      sideChannel.set(object, step);
      var valueSideChannel = getSideChannel();
      valueSideChannel.set(sentinel, sideChannel);
      pushToArray(values, stringify(value, keyPrefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, generateArrayPrefix === "comma" && encodeValuesOnly && isArray(obj) ? null : encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, valueSideChannel));
    }
    return values;
  };
  var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
    if (!opts) {
      return defaults;
    }
    if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
      throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
    }
    if (typeof opts.encodeDotInKeys !== "undefined" && typeof opts.encodeDotInKeys !== "boolean") {
      throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
    }
    if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
      throw new TypeError("Encoder has to be a function.");
    }
    var charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
      throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
    }
    var format = formats["default"];
    if (typeof opts.format !== "undefined") {
      if (!has.call(formats.formatters, opts.format)) {
        throw new TypeError("Unknown format option provided.");
      }
      format = opts.format;
    }
    var formatter = formats.formatters[format];
    var filter = defaults.filter;
    if (typeof opts.filter === "function" || isArray(opts.filter)) {
      filter = opts.filter;
    }
    var arrayFormat;
    if (opts.arrayFormat in arrayPrefixGenerators) {
      arrayFormat = opts.arrayFormat;
    } else if ("indices" in opts) {
      arrayFormat = opts.indices ? "indices" : "repeat";
    } else {
      arrayFormat = defaults.arrayFormat;
    }
    if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") {
      throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
    }
    var allowDots = typeof opts.allowDots === "undefined" ? opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
    return {
      addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults.addQueryPrefix,
      allowDots,
      allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
      arrayFormat,
      charset,
      charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
      commaRoundTrip: !!opts.commaRoundTrip,
      delimiter: typeof opts.delimiter === "undefined" ? defaults.delimiter : opts.delimiter,
      encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
      encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
      encoder: typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
      encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
      filter,
      format,
      formatter,
      serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
      skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
      sort: typeof opts.sort === "function" ? opts.sort : null,
      strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
    };
  };
  module.exports = function(object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);
    var objKeys;
    var filter;
    if (typeof options.filter === "function") {
      filter = options.filter;
      obj = filter("", obj);
    } else if (isArray(options.filter)) {
      filter = options.filter;
      objKeys = filter;
    }
    var keys = [];
    if (typeof obj !== "object" || obj === null) {
      return "";
    }
    var generateArrayPrefix = arrayPrefixGenerators[options.arrayFormat];
    var commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
    if (!objKeys) {
      objKeys = Object.keys(obj);
    }
    if (options.sort) {
      objKeys.sort(options.sort);
    }
    var sideChannel = getSideChannel();
    for (var i = 0;i < objKeys.length; ++i) {
      var key = objKeys[i];
      var value = obj[key];
      if (options.skipNulls && value === null) {
        continue;
      }
      pushToArray(keys, stringify(value, key, generateArrayPrefix, commaRoundTrip, options.allowEmptyArrays, options.strictNullHandling, options.skipNulls, options.encodeDotInKeys, options.encode ? options.encoder : null, options.filter, options.sort, options.allowDots, options.serializeDate, options.format, options.formatter, options.encodeValuesOnly, options.charset, sideChannel));
    }
    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? "?" : "";
    if (options.charsetSentinel) {
      if (options.charset === "iso-8859-1") {
        prefix += "utf8=%26%2310003%3B&";
      } else {
        prefix += "utf8=%E2%9C%93&";
      }
    }
    return joined.length > 0 ? prefix + joined : "";
  };
});

// node_modules/qs/lib/parse.js
var require_parse = __commonJS((exports, module) => {
  var utils = require_utils();
  var has = Object.prototype.hasOwnProperty;
  var isArray = Array.isArray;
  var defaults = {
    allowDots: false,
    allowEmptyArrays: false,
    allowPrototypes: false,
    allowSparse: false,
    arrayLimit: 20,
    charset: "utf-8",
    charsetSentinel: false,
    comma: false,
    decodeDotInKeys: false,
    decoder: utils.decode,
    delimiter: "&",
    depth: 5,
    duplicates: "combine",
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1000,
    parseArrays: true,
    plainObjects: false,
    strictDepth: false,
    strictNullHandling: false
  };
  var interpretNumericEntities = function(str) {
    return str.replace(/&#(\d+);/g, function($0, numberStr) {
      return String.fromCharCode(parseInt(numberStr, 10));
    });
  };
  var parseArrayValue = function(val, options) {
    if (val && typeof val === "string" && options.comma && val.indexOf(",") > -1) {
      return val.split(",");
    }
    return val;
  };
  var isoSentinel = "utf8=%26%2310003%3B";
  var charsetSentinel = "utf8=%E2%9C%93";
  var parseValues = function parseQueryStringValues(str, options) {
    var obj = { __proto__: null };
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, "") : str;
    cleanStr = cleanStr.replace(/%5B/gi, "[").replace(/%5D/gi, "]");
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);
    var skipIndex = -1;
    var i;
    var charset = options.charset;
    if (options.charsetSentinel) {
      for (i = 0;i < parts.length; ++i) {
        if (parts[i].indexOf("utf8=") === 0) {
          if (parts[i] === charsetSentinel) {
            charset = "utf-8";
          } else if (parts[i] === isoSentinel) {
            charset = "iso-8859-1";
          }
          skipIndex = i;
          i = parts.length;
        }
      }
    }
    for (i = 0;i < parts.length; ++i) {
      if (i === skipIndex) {
        continue;
      }
      var part = parts[i];
      var bracketEqualsPos = part.indexOf("]=");
      var pos = bracketEqualsPos === -1 ? part.indexOf("=") : bracketEqualsPos + 1;
      var key;
      var val;
      if (pos === -1) {
        key = options.decoder(part, defaults.decoder, charset, "key");
        val = options.strictNullHandling ? null : "";
      } else {
        key = options.decoder(part.slice(0, pos), defaults.decoder, charset, "key");
        val = utils.maybeMap(parseArrayValue(part.slice(pos + 1), options), function(encodedVal) {
          return options.decoder(encodedVal, defaults.decoder, charset, "value");
        });
      }
      if (val && options.interpretNumericEntities && charset === "iso-8859-1") {
        val = interpretNumericEntities(String(val));
      }
      if (part.indexOf("[]=") > -1) {
        val = isArray(val) ? [val] : val;
      }
      var existing = has.call(obj, key);
      if (existing && options.duplicates === "combine") {
        obj[key] = utils.combine(obj[key], val);
      } else if (!existing || options.duplicates === "last") {
        obj[key] = val;
      }
    }
    return obj;
  };
  var parseObject = function(chain, val, options, valuesParsed) {
    var leaf = valuesParsed ? val : parseArrayValue(val, options);
    for (var i = chain.length - 1;i >= 0; --i) {
      var obj;
      var root = chain[i];
      if (root === "[]" && options.parseArrays) {
        obj = options.allowEmptyArrays && (leaf === "" || options.strictNullHandling && leaf === null) ? [] : [].concat(leaf);
      } else {
        obj = options.plainObjects ? { __proto__: null } : {};
        var cleanRoot = root.charAt(0) === "[" && root.charAt(root.length - 1) === "]" ? root.slice(1, -1) : root;
        var decodedRoot = options.decodeDotInKeys ? cleanRoot.replace(/%2E/g, ".") : cleanRoot;
        var index = parseInt(decodedRoot, 10);
        if (!options.parseArrays && decodedRoot === "") {
          obj = { 0: leaf };
        } else if (!isNaN(index) && root !== decodedRoot && String(index) === decodedRoot && index >= 0 && (options.parseArrays && index <= options.arrayLimit)) {
          obj = [];
          obj[index] = leaf;
        } else if (decodedRoot !== "__proto__") {
          obj[decodedRoot] = leaf;
        }
      }
      leaf = obj;
    }
    return leaf;
  };
  var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
    if (!givenKey) {
      return;
    }
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, "[$1]") : givenKey;
    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;
    var segment = options.depth > 0 && brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;
    var keys = [];
    if (parent) {
      if (!options.plainObjects && has.call(Object.prototype, parent)) {
        if (!options.allowPrototypes) {
          return;
        }
      }
      keys.push(parent);
    }
    var i = 0;
    while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
      i += 1;
      if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
        if (!options.allowPrototypes) {
          return;
        }
      }
      keys.push(segment[1]);
    }
    if (segment) {
      if (options.strictDepth === true) {
        throw new RangeError("Input depth exceeded depth option of " + options.depth + " and strictDepth is true");
      }
      keys.push("[" + key.slice(segment.index) + "]");
    }
    return parseObject(keys, val, options, valuesParsed);
  };
  var normalizeParseOptions = function normalizeParseOptions(opts) {
    if (!opts) {
      return defaults;
    }
    if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
      throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
    }
    if (typeof opts.decodeDotInKeys !== "undefined" && typeof opts.decodeDotInKeys !== "boolean") {
      throw new TypeError("`decodeDotInKeys` option can only be `true` or `false`, when provided");
    }
    if (opts.decoder !== null && typeof opts.decoder !== "undefined" && typeof opts.decoder !== "function") {
      throw new TypeError("Decoder has to be a function.");
    }
    if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
      throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
    }
    var charset = typeof opts.charset === "undefined" ? defaults.charset : opts.charset;
    var duplicates = typeof opts.duplicates === "undefined" ? defaults.duplicates : opts.duplicates;
    if (duplicates !== "combine" && duplicates !== "first" && duplicates !== "last") {
      throw new TypeError("The duplicates option must be either combine, first, or last");
    }
    var allowDots = typeof opts.allowDots === "undefined" ? opts.decodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
    return {
      allowDots,
      allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
      allowPrototypes: typeof opts.allowPrototypes === "boolean" ? opts.allowPrototypes : defaults.allowPrototypes,
      allowSparse: typeof opts.allowSparse === "boolean" ? opts.allowSparse : defaults.allowSparse,
      arrayLimit: typeof opts.arrayLimit === "number" ? opts.arrayLimit : defaults.arrayLimit,
      charset,
      charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
      comma: typeof opts.comma === "boolean" ? opts.comma : defaults.comma,
      decodeDotInKeys: typeof opts.decodeDotInKeys === "boolean" ? opts.decodeDotInKeys : defaults.decodeDotInKeys,
      decoder: typeof opts.decoder === "function" ? opts.decoder : defaults.decoder,
      delimiter: typeof opts.delimiter === "string" || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
      depth: typeof opts.depth === "number" || opts.depth === false ? +opts.depth : defaults.depth,
      duplicates,
      ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
      interpretNumericEntities: typeof opts.interpretNumericEntities === "boolean" ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
      parameterLimit: typeof opts.parameterLimit === "number" ? opts.parameterLimit : defaults.parameterLimit,
      parseArrays: opts.parseArrays !== false,
      plainObjects: typeof opts.plainObjects === "boolean" ? opts.plainObjects : defaults.plainObjects,
      strictDepth: typeof opts.strictDepth === "boolean" ? !!opts.strictDepth : defaults.strictDepth,
      strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
    };
  };
  module.exports = function(str, opts) {
    var options = normalizeParseOptions(opts);
    if (str === "" || str === null || typeof str === "undefined") {
      return options.plainObjects ? { __proto__: null } : {};
    }
    var tempObj = typeof str === "string" ? parseValues(str, options) : str;
    var obj = options.plainObjects ? { __proto__: null } : {};
    var keys = Object.keys(tempObj);
    for (var i = 0;i < keys.length; ++i) {
      var key = keys[i];
      var newObj = parseKeys(key, tempObj[key], options, typeof str === "string");
      obj = utils.merge(obj, newObj, options);
    }
    if (options.allowSparse === true) {
      return obj;
    }
    return utils.compact(obj);
  };
});

// node_modules/qs/lib/index.js
var require_lib = __commonJS((exports, module) => {
  var stringify = require_stringify();
  var parse = require_parse();
  var formats = require_formats();
  module.exports = {
    formats,
    parse,
    stringify
  };
});

// src/index.ts
var import_reflect_metadata3 = __toESM(require_Reflect(), 1);

// src/keys/index.ts
var exports_keys = {};
__export(exports_keys, {
  zodSchemaKey: () => zodSchemaKey,
  webSocketServerArgsKey: () => webSocketServerArgsKey,
  webSocketMessageArgsKey: () => webSocketMessageArgsKey,
  webSocketKey: () => webSocketKey,
  webSocketEventKey: () => webSocketEventKey,
  webSocketEventArgumentsKey: () => webSocketEventArgumentsKey,
  webSocketConnectionArgsKey: () => webSocketConnectionArgsKey,
  webSocketCloseReasonArgsKey: () => webSocketCloseReasonArgsKey,
  webSocketCloseCodeArgsKey: () => webSocketCloseCodeArgsKey,
  routeModelArgsKey: () => routeModelArgsKey,
  responseHeadersArgsKey: () => responseHeadersArgsKey,
  responseBodyArgsKey: () => responseBodyArgsKey,
  requestHeadersArgsKey: () => requestHeadersArgsKey,
  requestHeaderArgsKey: () => requestHeaderArgsKey,
  requestBodyArgsKey: () => requestBodyArgsKey,
  requestArgsKey: () => requestArgsKey,
  queryArgsKey: () => queryArgsKey,
  paramsArgsKey: () => paramsArgsKey,
  paramArgsKey: () => paramArgsKey,
  moduleKey: () => moduleKey,
  middlewareKey: () => middlewareKey,
  injectableKey: () => injectableKey,
  injectKey: () => injectKey,
  httpServerArgsKey: () => httpServerArgsKey,
  guardKey: () => guardKey,
  dispatcherKey: () => dispatcherKey,
  controllerKey: () => controllerKey,
  controllerHttpKey: () => controllerHttpKey,
  contextArgsKey: () => contextArgsKey,
  configKey: () => configKey,
  argumentsKey: () => argumentsKey
});
var argumentsKey = Symbol("__bool:arguments__");
var webSocketEventArgumentsKey = Symbol("__bool:webSocketEventArguments__");
var configKey = Symbol("__bool:config__");
var controllerKey = Symbol("__bool:controller__");
var dispatcherKey = Symbol("__bool:dispatcher__");
var guardKey = Symbol("__bool:guard__");
var controllerHttpKey = Symbol("__bool:controller.http__");
var injectKey = Symbol("__bool:inject__");
var injectableKey = Symbol("__bool:injectable__");
var middlewareKey = Symbol("__bool:middleware__");
var moduleKey = Symbol("__bool:module__");
var zodSchemaKey = Symbol("__bool:zodSchema__");
var webSocketKey = Symbol("__bool:webSocket__");
var webSocketEventKey = Symbol("__bool:webSocket:event__");
var webSocketServerArgsKey = Symbol("__bool:webSocketArguments:server__");
var webSocketConnectionArgsKey = Symbol("__bool:webSocketArguments:connection__");
var webSocketMessageArgsKey = Symbol("__bool:webSocketArguments:message__");
var webSocketCloseCodeArgsKey = Symbol("__bool:webSocketArguments:closeCode__");
var webSocketCloseReasonArgsKey = Symbol("__bool:webSocketArguments:closeReason__");
var httpServerArgsKey = Symbol("__bool:httpArguments:server__");
var requestHeadersArgsKey = Symbol("__bool:httpArguments:requestHeaders__");
var requestHeaderArgsKey = Symbol("__bool:httpArguments:requestHeader__");
var requestBodyArgsKey = Symbol("__bool:httpArguments:requestBody__");
var paramsArgsKey = Symbol("__bool:httpArguments:params__");
var paramArgsKey = Symbol("__bool:httpArguments:param__");
var queryArgsKey = Symbol("__bool:httpArguments:query__");
var requestArgsKey = Symbol("__bool:httpArguments:request__");
var responseHeadersArgsKey = Symbol("__bool:httpArguments:responseHeaders__");
var contextArgsKey = Symbol("__bool:httpArguments:context__");
var routeModelArgsKey = Symbol("__bool:httpArguments:routeModel__");
var responseBodyArgsKey = Symbol("__bool:httpArguments:responseBody__");

// src/decorators/arguments.ts
var RequestHeaders = (schema) => (target, methodName, parameterIndex) => {
  if (!methodName) {
    return;
  }
  const requestHeadersMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
  requestHeadersMetadata[`argumentIndexes.${parameterIndex}`] = {
    index: parameterIndex,
    type: requestHeadersArgsKey,
    zodSchema: schema
  };
  Reflect.defineMetadata(argumentsKey, requestHeadersMetadata, target.constructor, methodName);
};
var RequestHeader = (key, schema) => (target, methodName, parameterIndex) => {
  if (!methodName) {
    return;
  }
  const requestHeaderMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
  requestHeaderMetadata[`argumentIndexes.${parameterIndex}`] = {
    index: parameterIndex,
    type: requestHeaderArgsKey,
    key,
    zodSchema: schema
  };
  Reflect.defineMetadata(argumentsKey, requestHeaderMetadata, target.constructor, methodName);
};
var RequestBody = (schema, parser) => (target, methodName, parameterIndex) => {
  if (!methodName) {
    return;
  }
  const bodyMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
  bodyMetadata[`argumentIndexes.${parameterIndex}`] = {
    index: parameterIndex,
    type: requestBodyArgsKey,
    zodSchema: schema,
    parser
  };
  Reflect.defineMetadata(argumentsKey, bodyMetadata, target.constructor, methodName);
};
var Params = (schema) => (target, methodName, parameterIndex) => {
  if (!methodName) {
    return;
  }
  const paramsMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
  paramsMetadata[`argumentIndexes.${parameterIndex}`] = {
    index: parameterIndex,
    type: paramsArgsKey,
    zodSchema: schema
  };
  Reflect.defineMetadata(argumentsKey, paramsMetadata, target.constructor, methodName);
};
var Param = (key, schema) => (target, methodName, parameterIndex) => {
  if (!methodName) {
    return;
  }
  const paramMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
  paramMetadata[`argumentIndexes.${parameterIndex}`] = {
    index: parameterIndex,
    type: paramArgsKey,
    key,
    zodSchema: schema
  };
  Reflect.defineMetadata(argumentsKey, paramMetadata, target.constructor, methodName);
};
var Query = (schema) => (target, methodName, parameterIndex) => {
  if (!methodName) {
    return;
  }
  const queryMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
  queryMetadata[`argumentIndexes.${parameterIndex}`] = {
    index: parameterIndex,
    type: queryArgsKey,
    zodSchema: schema
  };
  Reflect.defineMetadata(argumentsKey, queryMetadata, target.constructor, methodName);
};
var Request = (schema) => (target, methodName, parameterIndex) => {
  if (!methodName) {
    return;
  }
  const requestMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
  requestMetadata[`argumentIndexes.${parameterIndex}`] = {
    index: parameterIndex,
    type: requestArgsKey,
    zodSchema: schema
  };
  Reflect.defineMetadata(argumentsKey, requestMetadata, target.constructor, methodName);
};
var ResponseHeaders = () => (target, methodName, parameterIndex) => {
  if (!methodName) {
    return;
  }
  const responseHeadersMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
  responseHeadersMetadata[`argumentIndexes.${parameterIndex}`] = {
    index: parameterIndex,
    type: responseHeadersArgsKey
  };
  Reflect.defineMetadata(argumentsKey, responseHeadersMetadata, target.constructor, methodName);
};
var Context = (key) => (target, methodName, parameterIndex) => {
  if (!methodName) {
    return;
  }
  const responseHeadersMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
  responseHeadersMetadata[`argumentIndexes.${parameterIndex}`] = {
    index: parameterIndex,
    type: contextArgsKey,
    key
  };
  Reflect.defineMetadata(argumentsKey, responseHeadersMetadata, target.constructor, methodName);
};
var RouteModel = () => (target, methodName, parameterIndex) => {
  if (!methodName) {
    return;
  }
  const responseHeadersMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
  responseHeadersMetadata[`argumentIndexes.${parameterIndex}`] = {
    index: parameterIndex,
    type: routeModelArgsKey
  };
  Reflect.defineMetadata(argumentsKey, responseHeadersMetadata, target.constructor, methodName);
};
// src/decorators/controller.ts
var Controller = (prefix) => (target) => {
  const metadata = {
    prefix: !prefix?.startsWith("/") ? `/${prefix || ""}` : prefix,
    httpMetadata: [...Reflect.getOwnMetadata(controllerHttpKey, target.constructor) || []]
  };
  Reflect.defineMetadata(controllerKey, metadata, target);
};
// src/decorators/dispatcher.ts
var Dispatcher = () => (target) => {
  const metadata = undefined;
  Reflect.defineMetadata(dispatcherKey, metadata, target);
};
// src/decorators/guard.ts
var Guard = () => (target) => {
  if (!("enforce" in target.prototype) || typeof target.prototype.enforce !== "function") {
    return;
  }
  const metadata = undefined;
  Reflect.defineMetadata(guardKey, metadata, target);
};
// src/decorators/http.ts
var defaultDecorator = (path, method) => (target, methodName, descriptor) => {
  if (!(descriptor?.value instanceof Function)) {
    throw Error(`${method} decorator only use for class method.`);
  }
  const metadata = [
    ...Reflect.getOwnMetadata(controllerHttpKey, target.constructor) || [],
    {
      path: !path.startsWith("/") ? `/${path}` : path,
      httpMethod: method.toUpperCase(),
      methodName,
      descriptor
    }
  ];
  Reflect.defineMetadata(controllerHttpKey, metadata, target.constructor);
};
var Get = (path = "/") => defaultDecorator(path, "Get");
var Post = (path = "/") => defaultDecorator(path, "Post");
var Put = (path = "/") => defaultDecorator(path, "Put");
var Patch = (path = "/") => defaultDecorator(path, "Patch");
var Delete = (path = "/") => defaultDecorator(path, "Delete");
var Options = (path = "/") => defaultDecorator(path, "Options");
// src/decorators/inject.ts
var Inject = (definition) => {
  return (target, methodName, parameterIndex) => {
    const designParameterTypes = Reflect.getMetadata(injectKey, target) || [];
    designParameterTypes[parameterIndex] = definition;
    Reflect.defineMetadata(injectKey, designParameterTypes, target);
  };
};
// src/decorators/injectable.ts
var Injectable = () => (target) => Reflect.defineMetadata(injectableKey, undefined, target);
// src/decorators/middleware.ts
var Middleware = () => (target) => {
  const metadata = undefined;
  Reflect.defineMetadata(middlewareKey, metadata, target);
};
// src/decorators/module.ts
var Module = (args) => (target) => {
  const { middlewares, guards, dispatchers, controllers, dependencies, webSockets } = args || {};
  if (middlewares) {
    for (let i = 0;i < middlewares.length; i++) {
      if (!Reflect.getOwnMetadataKeys(middlewares[i]).includes(middlewareKey)) {
        throw Error(`${middlewares[i].name} is not a middleware.`);
      }
    }
  }
  if (guards) {
    for (let i = 0;i < guards.length; i++) {
      if (!Reflect.getOwnMetadataKeys(guards[i]).includes(guardKey)) {
        throw Error(`${guards[i].name} is not a guard.`);
      }
    }
  }
  if (dispatchers) {
    for (let i = 0;i < dispatchers.length; i++) {
      if (!Reflect.getOwnMetadataKeys(dispatchers[i]).includes(dispatcherKey)) {
        throw Error(`${dispatchers[i].name} is not a dispatcher.`);
      }
    }
  }
  if (controllers) {
    for (let i = 0;i < controllers.length; i++) {
      if (!Reflect.getOwnMetadataKeys(controllers[i]).includes(controllerKey)) {
        throw Error(`${controllers[i].name} is not a controller.`);
      }
    }
  }
  if (dependencies) {
    for (let i = 0;i < dependencies.length; i++) {
      if (!Reflect.getOwnMetadataKeys(dependencies[i]).includes(injectableKey)) {
        throw Error(`${dependencies[i].name} is not an injectable.`);
      }
    }
  }
  if (webSockets) {
    for (let i = 0;i < webSockets.length; i++) {
      if (!Reflect.getOwnMetadataKeys(webSockets[i]).includes(webSocketKey)) {
        throw Error(`${webSockets[i].name} is not a websocket gateway.`);
      }
    }
  }
  Reflect.defineMetadata(moduleKey, args, target);
};
// src/decorators/webSocket.ts
var upgradeHandlerSymbol = Symbol("__bool:webSocket.upgrade__");
var upgradeHandler = (server, request, query) => {
  const url = new URL(request.url);
  return server.upgrade(request, {
    data: {
      method: request.method.toUpperCase(),
      pathname: url.pathname,
      query
    }
  });
};
var WebSocket2 = (args) => (target) => {
  const { prefix } = args || {};
  target.prototype[upgradeHandlerSymbol] = upgradeHandler;
  const descriptor = Object.getOwnPropertyDescriptor(target.prototype, upgradeHandlerSymbol);
  const httpMetadata = !descriptor ? [] : [
    {
      path: "/",
      httpMethod: "GET",
      methodName: upgradeHandlerSymbol,
      descriptor
    },
    {
      path: "/",
      httpMethod: "POST",
      methodName: upgradeHandlerSymbol,
      descriptor
    }
  ];
  const metadata = {
    prefix: !prefix?.startsWith("/") ? `/${prefix || ""}` : prefix,
    events: Reflect.getOwnMetadata(webSocketEventKey, target) || {},
    http: httpMetadata
  };
  Reflect.defineMetadata(webSocketKey, metadata, target);
};
// src/decorators/webSocketArguments.ts
var WebSocketConnection = () => (target, methodName, parameterIndex) => {
  if (!methodName) {
    return;
  }
  const webSocketEventArgumentsMetadata = Reflect.getOwnMetadata(webSocketEventArgumentsKey, target.constructor, methodName) || {};
  webSocketEventArgumentsMetadata[`argumentIndexes.${parameterIndex}`] = {
    index: parameterIndex,
    type: webSocketConnectionArgsKey
  };
  Reflect.defineMetadata(webSocketEventArgumentsKey, webSocketEventArgumentsMetadata, target.constructor, methodName);
};
var WebSocketServer = () => (target, methodName, parameterIndex) => {
  if (!methodName) {
    return;
  }
  const webSocketEventArgumentsMetadata = Reflect.getOwnMetadata(webSocketEventArgumentsKey, target.constructor, methodName) || {};
  webSocketEventArgumentsMetadata[`argumentIndexes.${parameterIndex}`] = {
    index: parameterIndex,
    type: webSocketServerArgsKey
  };
  Reflect.defineMetadata(webSocketEventArgumentsKey, webSocketEventArgumentsMetadata, target.constructor, methodName);
};
var WebSocketCloseCode = () => (target, methodName, parameterIndex) => {
  if (!methodName) {
    return;
  }
  const webSocketEventArgumentsMetadata = Reflect.getOwnMetadata(webSocketEventArgumentsKey, target.constructor, methodName) || {};
  webSocketEventArgumentsMetadata[`argumentIndexes.${parameterIndex}`] = {
    index: parameterIndex,
    type: webSocketCloseCodeArgsKey
  };
  Reflect.defineMetadata(webSocketEventArgumentsKey, webSocketEventArgumentsMetadata, target.constructor, methodName);
};
var WebSocketCloseReason = () => (target, methodName, parameterIndex) => {
  if (!methodName) {
    return;
  }
  const webSocketEventArgumentsMetadata = Reflect.getOwnMetadata(webSocketEventArgumentsKey, target.constructor, methodName) || {};
  webSocketEventArgumentsMetadata[`argumentIndexes.${parameterIndex}`] = {
    index: parameterIndex,
    type: webSocketCloseReasonArgsKey
  };
  Reflect.defineMetadata(webSocketEventArgumentsKey, webSocketEventArgumentsMetadata, target.constructor, methodName);
};
// src/decorators/webSocketEvent.ts
var WebSocketEvent = (eventName) => (target, methodName, descriptor) => {
  if (!(descriptor.value instanceof Function)) {
    throw Error("WebSocketEvent decorator only use for class's method.");
  }
  const webSocketEventArgumentsMetadata = Reflect.getOwnMetadata(webSocketEventArgumentsKey, target.constructor, methodName);
  const webSocketEventMetadata = Object.freeze({
    methodName,
    descriptor,
    arguments: webSocketEventArgumentsMetadata
  });
  const webSocketMetadata = {
    ...Reflect.getOwnMetadata(webSocketEventKey, target.constructor) || undefined,
    [eventName]: webSocketEventMetadata
  };
  Reflect.defineMetadata(webSocketEventKey, webSocketEventMetadata, target.constructor, methodName);
  Reflect.defineMetadata(webSocketEventKey, webSocketMetadata, target.constructor);
};
// src/decorators/zodSchema.ts
var ZodSchema = (schema) => {
  return (target, methodName, parameterIndex) => {
    if (!methodName) {
      return;
    }
    const zodSchemasMetadata = Reflect.getOwnMetadata(zodSchemaKey, target.constructor, methodName) || {};
    zodSchemasMetadata[`paramterIndexes.${parameterIndex}`] = {
      index: parameterIndex,
      schema
    };
    Reflect.defineMetadata(zodSchemaKey, zodSchemasMetadata, target.constructor, methodName);
  };
};
// src/hooks/factory.ts
var import_reflect_metadata2 = __toESM(require_Reflect(), 1);
var import_qs = __toESM(require_lib(), 1);

// node_modules/@bool-ts/date-time/dist/index.js
var ETimeUnit;
(function(ETimeUnit2) {
  ETimeUnit2["year"] = "year";
  ETimeUnit2["month"] = "month";
  ETimeUnit2["day"] = "day";
  ETimeUnit2["hours"] = "hours";
  ETimeUnit2["minutes"] = "minutes";
  ETimeUnit2["seconds"] = "seconds";
  ETimeUnit2["miliseconds"] = "miliseconds";
})(ETimeUnit || (ETimeUnit = {}));
var add = (time, value, unit = ETimeUnit.day) => {
  const date = time instanceof Date ? time : new Date(time);
  switch (unit) {
    case ETimeUnit.year:
      date.setFullYear(date.getFullYear() + value);
      break;
    case ETimeUnit.month:
      date.setMonth(date.getMonth() + value);
      break;
    case ETimeUnit.day:
      date.setDate(date.getDate() + value);
      break;
    case ETimeUnit.hours:
      date.setHours(date.getHours() + value);
      break;
    case ETimeUnit.minutes:
      date.setMinutes(date.getMinutes() + value);
      break;
    case ETimeUnit.seconds:
      date.setSeconds(date.getSeconds() + value);
      break;
    case ETimeUnit.miliseconds:
      date.setMilliseconds(date.getMilliseconds() + value);
      break;
  }
  return date;
};

// src/entities/httpRoute.ts
class HttpRoute {
  static rootPattern = ":([a-z0-9A-Z_-]{1,})";
  static innerRootPattern = "([a-z0-9A-Z_-]{1,})";
  alias;
  _map = new Map;
  constructor(alias) {
    this.alias = this._thinAlias(alias);
  }
  test(pathname, method) {
    try {
      const model = this._map.get(method);
      const aliasSplitted = this.alias.split("/");
      const currentPathNameSplitted = this._thinAlias(pathname).split("/");
      if (!model) {
        return;
      }
      if (aliasSplitted.length !== currentPathNameSplitted.length) {
        return;
      }
      const parameters = Object();
      const matchingRegex = this.alias.replace(new RegExp(HttpRoute.rootPattern, "g"), HttpRoute.innerRootPattern);
      if (!new RegExp(matchingRegex).test(this._thinAlias(pathname))) {
        return;
      }
      for (let index = 0;index < aliasSplitted.length; index++) {
        const aliasPart = aliasSplitted[index];
        const pathnamePart = currentPathNameSplitted[index];
        if (!new RegExp(HttpRoute.rootPattern, "g").test(aliasPart)) {
          if (aliasPart !== pathnamePart)
            return;
        } else {
          let isFailed = false;
          aliasPart.replace(new RegExp(HttpRoute.rootPattern, "g"), (match, key, offset) => {
            if (offset === 0) {
              pathnamePart.replace(new RegExp(HttpRoute.innerRootPattern, "g"), (innerMatch, innerKey, innerOffset) => {
                if (innerOffset === 0) {
                  Object.assign(parameters, {
                    [key]: innerMatch
                  });
                }
                return innerMatch;
              });
            }
            return match;
          });
          if (isFailed) {
            return;
          }
        }
        continue;
      }
      return Object.freeze({
        parameters,
        model
      });
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  isMatch(pathname, method) {
    try {
      const handlers = this._map.get(method);
      if (!handlers) {
        return;
      }
      const aliasSplitted = this.alias.split("/");
      const currentPathNameSplitted = this._thinAlias(pathname).split("/");
      if (aliasSplitted.length !== currentPathNameSplitted.length) {
        return false;
      }
      const parameters = Object();
      for (let index = 0;index < aliasSplitted.length; index++) {
        const aliasPart = aliasSplitted[index];
        const pathnamePart = currentPathNameSplitted[index];
        if (!new RegExp(HttpRoute.rootPattern, "g").test(aliasPart)) {
          if (aliasPart !== pathnamePart) {
            return false;
          }
        } else {
          let isFailed = false;
          aliasPart.replace(new RegExp(HttpRoute.rootPattern, "g"), (subString, key, value) => {
            if (!new RegExp(value, "g").test(pathnamePart)) {
              isFailed = true;
            } else {
              Object.assign(parameters, {
                [key]: pathnamePart
              });
            }
            return "";
          });
          if (isFailed) {
            return false;
          }
        }
        continue;
      }
      return true;
    } catch (err) {
      console.error(err);
      return;
    }
  }
  get(handler) {
    const currenTHttpRouteModel = this._map.get("GET");
    if (!currenTHttpRouteModel) {
      this._map.set("GET", handler);
    }
    return this;
  }
  post(handler) {
    const currenTHttpRouteModel = this._map.get("POST");
    if (!currenTHttpRouteModel) {
      this._map.set("POST", handler);
    }
    return this;
  }
  put(handler) {
    const currenTHttpRouteModel = this._map.get("PUT");
    if (!currenTHttpRouteModel) {
      this._map.set("PUT", handler);
    }
    return this;
  }
  delete(handler) {
    const currenTHttpRouteModel = this._map.get("DELETE");
    if (!currenTHttpRouteModel) {
      this._map.set("DELETE", handler);
    }
    return this;
  }
  connect(handler) {
    const currenTHttpRouteModel = this._map.get("CONNECT");
    if (!currenTHttpRouteModel) {
      return this._map.set("CONNECT", handler);
    }
    return this;
  }
  options(handler) {
    const currenTHttpRouteModel = this._map.get("OPTIONS");
    if (!currenTHttpRouteModel) {
      return this._map.set("OPTIONS", handler);
    }
    return this;
  }
  trace(handler) {
    const currenTHttpRouteModel = this._map.get("TRACE");
    if (!currenTHttpRouteModel) {
      return this._map.set("TRACE", handler);
    }
    return this;
  }
  patch(handler) {
    const currenTHttpRouteModel = this._map.get("PATCH");
    if (!currenTHttpRouteModel) {
      return this._map.set("PATCH", handler);
    }
    return this;
  }
  _thinAlias(alias) {
    return alias.replace(new RegExp("[/]{2,}", "g"), "/").replace(new RegExp("^[/]|[/]$", "g"), "");
  }
  get _fullPath() {
    const pathSplited = this.alias.split("/");
    const blockFiltered = pathSplited.map((value, index) => {
      let validateReg = new RegExp(":([a-z0-9A-Z_.-]{1,})(\\(.*?\\))", "g");
      if (!validateReg.test(value)) {
        validateReg = new RegExp(":([a-z0-9A-Z_.-]{1,})", "g");
        if (!validateReg.test(value)) {
          return value;
        }
        return value.replace(validateReg, (value2, index2) => `${value2}(.*?)`);
      }
      return value;
    });
    return blockFiltered.join("/");
  }
  get _filteredPath() {
    const pathSplited = this.alias.split("/");
    const blockFiltered = pathSplited.map((value, index) => {
      let validateReg = new RegExp(":([a-z0-9A-Z_.-]{1,})((.*?))", "g");
      if (!validateReg.test(value)) {
        validateReg = new RegExp(":([a-z0-9A-Z_.-]{1,})", "g");
        if (!validateReg.test(value)) {
          return value;
        }
        return value.replace(validateReg, (value2, index2) => "(.*?)");
      }
      return value.replace(validateReg, (subString, arg_01, arg_02) => arg_02);
    });
    return blockFiltered.join("/");
  }
}
var httpRoute_default = HttpRoute;
// src/entities/httpRouter.ts
class HttpRouter {
  alias;
  _routes = new Map;
  constructor(alias) {
    this.alias = this._thinAlias(alias);
  }
  route(alias) {
    const thinAlias = this._thinAlias(`${this.alias}/${alias}`);
    const route = this._routes.get(thinAlias);
    const newRoute = !route ? new httpRoute_default(`${this.alias}/${alias}`) : route;
    if (!route) {
      this._routes.set(thinAlias, newRoute);
    }
    return newRoute;
  }
  _thinAlias(alias) {
    return alias.replace(new RegExp("[/]{2,}", "g"), "/").replace(new RegExp("^[/]|[/]$", "g"), "");
  }
  get routes() {
    return this._routes;
  }
}
// src/entities/httpRouterGroup.ts
class HttpRouterGroup {
  _routers = new Map;
  add(...routers) {
    for (let i = 0;i < routers.length; i++) {
      if (this._routers.has(routers[i].alias)) {
        continue;
      }
      this._routers.set(routers[i].alias, routers[i]);
    }
    return this;
  }
  find(pathame, method) {
    for (const router of [...this._routers.values()]) {
      for (const route of router.routes.values()) {
        const result = route.test(pathame, method);
        if (!result) {
          continue;
        }
        return result;
      }
    }
    return;
  }
}
// src/entities/webSocketRoute.ts
class WebSocketRoute {
  eventName;
  metadata;
  _context = undefined;
  constructor({
    eventName,
    metadata
  }) {
    this.eventName = eventName;
    this.metadata = metadata;
  }
  bind(instance) {
    this._context = instance;
    return this;
  }
  execute() {
    return Object.freeze({
      methodName: this.metadata.methodName,
      descriptor: !this._context || typeof this.metadata.descriptor.value !== "function" ? this.metadata.descriptor : this.metadata.descriptor.value.bind(this._context),
      arguments: this.metadata.arguments
    });
  }
}
// src/entities/webSocketRouter.ts
class WebSocketRouter {
  rawAlias;
  alias;
  routes = [];
  constructor(rawAlias = "/") {
    this.rawAlias = rawAlias;
    this.alias = WebSocketRouter.thinAlias(rawAlias);
  }
  addRoutes(...routes) {
    for (const route of routes) {
      if (!this.routes.includes(route)) {
        this.routes.push(route);
      }
    }
    return this;
  }
  bind(instance) {
    for (const route of this.routes) {
      route.bind(instance);
    }
    return this;
  }
  execute() {
    const map = new Map;
    for (const route of this.routes) {
      map.set(`${this.alias}:::${route.eventName}`, route.execute());
    }
    return map;
  }
  static thinAlias(alias) {
    return alias.replace(new RegExp("[/]{2,}", "g"), "/").replace(new RegExp("^[/]|[/]$", "g"), "");
  }
}
// src/entities/webSocketRouterGroup.ts
class WebSocketRouterGroup {
  rawPrefix;
  prefix;
  routers = [];
  constructor(rawPrefix = "/") {
    this.rawPrefix = rawPrefix;
    this.prefix = WebSocketRouterGroup.thinPrefix(rawPrefix);
  }
  addRouters(...routers) {
    for (let i = 0;i < routers.length; i++) {
      if (!this.routers.includes(routers[i])) {
        this.routers.push(routers[i]);
      }
    }
    for (const router of routers) {
      if (!this.routers.includes(router)) {
        this.routers.push(router);
      }
    }
    return this;
  }
  execute() {
    const map = new Map;
    for (const router of this.routers) {
      const routerMap = router.execute();
      for (const [routerKey, metadata] of routerMap.entries()) {
        map.set(`/${WebSocketRouterGroup.thinPrefix(`${this.prefix}/${routerKey}`)}`, metadata);
      }
    }
    return map;
  }
  static thinPrefix(prefix) {
    return prefix.replace(new RegExp("[/]{2,}", "g"), "/").replace(new RegExp("^[/]|[/]$", "g"), "");
  }
}
// src/http/clientError.ts
var httpClientErrors = Object.freeze({
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  402: "PAYMENT_REQUIRED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  405: "METHOD_NOT_ALLOWED",
  406: "NOT_ACCEPTABLE",
  407: "PROXY_AUTHENCATION_REQUIRED",
  408: "REQUEST_TIMEOUT",
  409: "CONFLICT",
  410: "GONE",
  411: "LENGTH_REQUIRED",
  412: "PRECONDITION_FAILED",
  413: "PAYLOAD_TOO_LARGE",
  414: "URI_TOO_LONG",
  415: "UNSUPPORTED_MEDIA_TYPE",
  416: "RANGE_NOT_SATISFIABLE",
  417: "EXPECTATION_FAILED",
  418: "IM_A_TEAPOT",
  421: "MISDIRECTED_REQUEST",
  422: "UNPROCESSABLE_ENTITY",
  423: "LOCKED",
  424: "FAILED_DEPENDENCY",
  425: "TOO_EARLY_",
  426: "UPGRAGE_REQUIRED",
  428: "PRECONDITION_REQUIRED",
  429: "TOO_MANY_REQUESTS",
  431: "REQUEST_HEADER_FIELDS_TOO_LARGE",
  451: "UNAVAILABLE_FOR_LEGAL_REASONS"
});

class HttpClientError extends Error {
  httpCode;
  message;
  data;
  constructor({ httpCode, data, message }) {
    super();
    this.httpCode = httpCode;
    this.message = !message?.trim() ? httpClientErrors[httpCode] : message.trim();
    this.data = data;
  }
}

// src/http/serverError.ts
var httpServerErrors = Object.freeze({
  500: "INTERNAL_SERVER_ERROR",
  501: "NOT_IMPLEMENTED",
  502: "BAD_GATEWAY",
  503: "SERVICE_UNAVAILABLE",
  504: "GATEWAY_TIMEOUT",
  505: "HTTP_VERSION_NOT_SUPPORTED",
  506: "VARIANT_ALSO_NEGOTIATES",
  507: "INSUFFICIENT_STORAGE",
  508: "LOOP_DETECTED",
  510: "NOT_EXTENDED",
  511: "NETWORK_AUTHENTICATION_REQUIRED"
});

class HttpServerError extends Error {
  httpCode;
  message;
  data;
  constructor({ httpCode, data, message }) {
    super();
    this.httpCode = httpCode;
    this.message = !message?.trim() ? httpServerErrors[httpCode] : message.trim();
    this.data = data;
  }
}

// src/http/index.ts
var jsonErrorInfer = (data, headers = new Headers) => {
  headers.set("Content-Type", "application/json");
  if (data instanceof HttpClientError || data instanceof HttpServerError) {
    return new Response(JSON.stringify(data), {
      status: data.httpCode,
      statusText: data.message,
      headers
    });
  }
  return new Response(JSON.stringify((() => {
    switch (typeof data) {
      case "object":
        return !(data instanceof Error) ? data : {
          message: data.message,
          code: data.name,
          cause: data.cause
        };
      case "string":
        return {
          message: data
        };
      case "number":
        return {
          code: data
        };
      default:
        return;
    }
  })()), {
    status: 500,
    statusText: "INTERNAL SERVER ERROR",
    headers
  });
};

// src/ultils/asyncFunction.ts
var AsyncFunction = async function() {
}.constructor;
// src/ultils/colors.ts
var ansiColors = Object.freeze({
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
  gray: 90
});
var backgroundColors = Object.freeze({
  black: 40,
  red: 41,
  green: 42,
  yellow: 43,
  blue: 44,
  magenta: 45,
  cyan: 46,
  white: 47,
  gray: 100
});
var ansiText = (text, options = {}) => {
  const { color, backgroundColor, bold, underline } = options;
  let ansiCode = "";
  if (bold) {
    ansiCode += "\x1B[1m";
  }
  if (underline) {
    ansiCode += "\x1B[4m";
  }
  if (color && ansiColors[color]) {
    ansiCode += `\x1B[${ansiColors[color]}m`;
  }
  if (backgroundColor && backgroundColors[backgroundColor]) {
    ansiCode += `\x1B[${backgroundColors[backgroundColor]}m`;
  }
  return `${ansiCode}${text}\x1B[0m`;
};
// src/ultils/socket.ts
var isWebSocketUpgrade = (request) => {
  const headers = request.headers;
  const method = request.method;
  const upgrade = headers.get("upgrade")?.toLowerCase() || "";
  const connection = headers.get("connection")?.toLowerCase() || "";
  return method === "GET" && upgrade?.toLowerCase() === "websocket" && connection?.toLowerCase().includes("upgrade");
};
// src/hooks/injector.ts
var import_reflect_metadata = __toESM(require_Reflect(), 1);
class Injector {
  _mapper = new Map;
  get(definition) {
    if (this._mapper.has(definition)) {
      return this._mapper.get(definition);
    }
    if (typeof definition !== "function") {
      return;
    }
    const ownMetadataKeys = Reflect.getMetadataKeys(definition);
    if (![injectableKey, controllerKey, middlewareKey, guardKey, dispatcherKey, webSocketKey].some((value) => ownMetadataKeys.includes(value))) {
      throw Error("Missing dependency declaration, please check @Injectable() used on dependency(ies).");
    }
    const dependencies = Reflect.getOwnMetadata(injectKey, definition) || [];
    const injections = dependencies.map((dependency) => this.get(dependency));
    const instance = new definition(...injections);
    this._mapper.set(definition, instance);
    return instance;
  }
  set(key, value) {
    this._mapper.set(key, value);
  }
}

// src/hooks/factory.ts
var DEFAULT_STATIC_CACHE_TIME_IN_SECONDS = 900;
var responseConverter = (response) => {
  response.headers.set("X-Powered-By", "Bool Typescript");
  return response;
};
var controllerCreator = ({
  controllerConstructor,
  httpRouterGroup,
  injector,
  prefix
}) => {
  if (!Reflect.getOwnMetadataKeys(controllerConstructor).includes(controllerKey)) {
    throw Error(`${controllerConstructor.name} is not a controller.`);
  }
  const controller = injector.get(controllerConstructor);
  if (!controller) {
    throw Error("Can not initialize controller.");
  }
  const controllerMetadata = Reflect.getOwnMetadata(controllerKey, controllerConstructor) || {
    prefix: "/",
    httpMetadata: []
  };
  const routesMetadata = Reflect.getOwnMetadata(controllerHttpKey, controllerConstructor) || [];
  const router = new HttpRouter(`/${prefix || ""}/${controllerMetadata.prefix}`);
  routesMetadata.forEach((routeMetadata) => {
    if (typeof routeMetadata.descriptor.value !== "function") {
      return;
    }
    const route = router.route(routeMetadata.path);
    const handler = routeMetadata.descriptor.value.bind(controller);
    const routeArgument = Object.freeze({
      class: controllerConstructor,
      funcName: routeMetadata.methodName,
      func: handler
    });
    switch (routeMetadata.httpMethod) {
      case "GET":
        return route.get(routeArgument);
      case "POST":
        return route.post(routeArgument);
      case "PUT":
        return route.put(routeArgument);
      case "PATCH":
        return route.patch(routeArgument);
      case "DELETE":
        return route.delete(routeArgument);
      case "OPTIONS":
        return route.options(routeArgument);
    }
  });
  return httpRouterGroup.add(router);
};
var webSocketCreator = ({
  injector,
  httpRouterGroup,
  prefix,
  webSocketRouterGroup,
  webSocketConstructor
}) => {
  if (!Reflect.getOwnMetadataKeys(webSocketConstructor).includes(webSocketKey)) {
    throw Error(`${webSocketConstructor.name} is not a controller.`);
  }
  const webSocket = injector.get(webSocketConstructor);
  if (!webSocket) {
    throw Error("Can not initialize webSocket.");
  }
  const webSocketMetadata = Reflect.getOwnMetadata(webSocketKey, webSocketConstructor) || {
    prefix: "/",
    events: [],
    http: []
  };
  const fullPrefix = `/${prefix || ""}/${webSocketMetadata.prefix}`;
  const router = new HttpRouter(fullPrefix);
  for (const [_key, httpMetadata] of Object.entries(webSocketMetadata.http)) {
    if (typeof httpMetadata.descriptor?.value !== "function") {
      continue;
    }
    const route = router.route(httpMetadata.path);
    const handler = httpMetadata.descriptor.value.bind(webSocket);
    const routeArgument = Object.freeze({
      class: webSocketConstructor,
      funcName: httpMetadata.methodName,
      func: handler
    });
    switch (httpMetadata.httpMethod) {
      case "GET":
        route.get(routeArgument);
        break;
      case "POST":
        route.post(routeArgument);
        break;
    }
  }
  httpRouterGroup.add(router);
  const webSocketRouter = new WebSocketRouter(fullPrefix);
  for (const [key, event] of Object.entries(webSocketMetadata.events)) {
    const webSocketRoute = new WebSocketRoute({
      eventName: key,
      metadata: event
    });
    webSocketRouter.addRoutes(webSocketRoute);
  }
  webSocketRouter.bind(webSocket);
  webSocketRouterGroup.addRouters(webSocketRouter);
  return Object.freeze({
    httpRouterGroup,
    webSocketRouterGroup
  });
};
var argumentsResolution = async (data, zodSchema, argumentIndex, funcName) => {
  try {
    const validation = await zodSchema.safeParseAsync(data);
    if (!validation.success) {
      throw new HttpClientError({
        httpCode: 400,
        message: `Validation at the [${funcName.toString()}] method fails at positional argument [${argumentIndex}].`,
        data: validation.error.issues
      });
    }
    return validation.data;
  } catch (error) {
    if (error instanceof HttpClientError) {
      throw error;
    }
    throw new HttpServerError({
      httpCode: 500,
      message: `Validation at the [${funcName.toString()}] method error at positional argument [${argumentIndex}].`,
      data: !(error instanceof Error) ? error : [
        {
          message: error.message,
          code: error.name,
          cause: error.cause
        }
      ]
    });
  }
};
var moduleResolution = async (module, options) => {
  if (!Reflect.getOwnMetadataKeys(module).includes(moduleKey)) {
    throw Error(`${module.name} is not a module.`);
  }
  const injector = new Injector;
  const moduleMetadata = Reflect.getOwnMetadata(moduleKey, module);
  if (!moduleMetadata) {
    return;
  }
  const {
    loaders,
    middlewares,
    guards,
    dispatchers,
    controllers,
    dependencies,
    webSockets,
    prefix: modulePrefix,
    config: moduleConfig
  } = moduleMetadata;
  const fullPrefix = `${options.prefix || ""}/${modulePrefix || ""}`;
  const { config } = Object.freeze({
    config: {
      ...typeof options.config !== "function" ? options.config : await options.config(),
      ...typeof moduleConfig !== "function" ? typeof moduleConfig !== "object" ? undefined : moduleConfig : await moduleConfig()
    }
  });
  injector.set(configKey, config);
  if (loaders) {
    const loaderFunctions = [];
    for (const [key, func] of Object.entries(loaders)) {
      loaderFunctions.push(async () => {
        try {
          const result = await func({ config });
          console.info(`${ansiText(" INFO ", {
            color: "white",
            backgroundColor: "blue",
            bold: true
          })} Loader [${key}] initialized successfully.`);
          return result;
        } catch (error) {
          console.error(`${ansiText(" WARN ", {
            color: "yellow",
            backgroundColor: "red",
            bold: true
          })} Loader [${key}] initialization failed.`);
          options.debug && console.error(error);
          throw error;
        }
      });
    }
    const results = await Promise.all(loaderFunctions.map((func) => func()));
    for (let i = 0;i < results.length; i++) {
      const [key, value] = results[i];
      injector.set(key, value);
    }
  }
  !dependencies || dependencies.map((dependency) => injector.get(dependency));
  const startMiddlewareGroup = [];
  const endMiddlewareGroup = [];
  middlewares && middlewares.forEach((middleware) => {
    const instance = injector.get(middleware);
    if (instance.start && typeof instance.start === "function") {
      startMiddlewareGroup.push(Object.freeze({
        class: middleware,
        funcName: "start",
        func: instance.start.bind(instance)
      }));
    }
    if (instance.end && typeof instance.end === "function") {
      endMiddlewareGroup.push(Object.freeze({
        class: middleware,
        funcName: "end",
        func: instance.end.bind(instance)
      }));
    }
  });
  const guardGroup = !guards ? [] : guards.map((guard) => {
    const guardInstance = injector.get(guard);
    return Object.freeze({
      class: guard,
      funcName: "enforce",
      func: guardInstance.enforce.bind(guardInstance)
    });
  });
  const openDispatcherGroup = [];
  const closeDispatcherGroup = [];
  dispatchers && dispatchers.forEach((dispatcher) => {
    const instance = injector.get(dispatcher);
    if (instance.open && typeof instance.open === "function") {
      openDispatcherGroup.push(Object.freeze({
        class: dispatcher,
        funcName: "open",
        func: instance.open.bind(instance)
      }));
    }
    if (instance.close && typeof instance.close === "function") {
      closeDispatcherGroup.push(Object.freeze({
        class: dispatcher,
        funcName: "close",
        func: instance.close.bind(instance)
      }));
    }
  });
  const controllerRouterGroup = new HttpRouterGroup;
  controllers && controllers.forEach((controllerConstructor) => controllerCreator({
    controllerConstructor,
    httpRouterGroup: controllerRouterGroup,
    injector,
    prefix: fullPrefix
  }));
  const webSocketHttpRouterGroup = new HttpRouterGroup;
  const webSocketRouterGroup = new WebSocketRouterGroup;
  webSockets && webSockets.forEach((webSocket) => webSocketCreator({
    webSocketConstructor: webSocket,
    httpRouterGroup: webSocketHttpRouterGroup,
    webSocketRouterGroup,
    injector,
    prefix: fullPrefix
  }));
  return Object.freeze({
    prefix: moduleMetadata.prefix,
    injector,
    startMiddlewareGroup,
    endMiddlewareGroup,
    guardGroup,
    openDispatcherGroup,
    closeDispatcherGroup,
    controllerRouterGroup,
    webSocketHttpRouterGroup,
    webSocketRouterGroup
  });
};
var webSocketFetcher = async (bun, bool) => {
  const { request, server } = bun;
  const {
    query,
    responseHeaders,
    route: { model }
  } = bool;
  const isUpgrade = await model.func(...[server, request, query]);
  if (typeof isUpgrade !== "boolean") {
    return responseConverter(new Response(JSON.stringify({
      httpCode: 500,
      message: "Can not detect webSocket upgrade result.",
      data: undefined
    }), {
      status: 500,
      statusText: "Internal server error.",
      headers: responseHeaders
    }));
  }
  if (!isUpgrade) {
    return responseConverter(new Response(JSON.stringify({
      httpCode: 500,
      message: "Can not upgrade.",
      data: undefined
    }), {
      status: 500,
      statusText: "Internal server error.",
      headers: responseHeaders
    }));
  }
  return isUpgrade;
};
var httpFetcher = async (bun, bool) => {
  const { request, server: _server } = bun;
  const {
    query,
    responseHeaders,
    route: { parameters, model },
    moduleResolution: {
      startMiddlewareGroup,
      endMiddlewareGroup,
      guardGroup,
      openDispatcherGroup,
      closeDispatcherGroup
    }
  } = bool;
  const context = {
    [requestHeadersArgsKey]: request.headers,
    [responseHeadersArgsKey]: responseHeaders,
    [queryArgsKey]: query,
    [paramsArgsKey]: parameters,
    [routeModelArgsKey]: model
  };
  const contextHook = {
    get(key) {
      return context[key];
    },
    set(key, value) {
      if (key in context) {
        throw Error(`${String(key)} already exists in context.`);
      }
      context[key] = value;
    }
  };
  for (let i = 0;i < startMiddlewareGroup.length; i++) {
    const args = [];
    const collection = startMiddlewareGroup[i];
    const metadata = Reflect.getOwnMetadata(argumentsKey, collection.class, collection.funcName) || {};
    if (metadata) {
      for (const [_key, argsMetadata] of Object.entries(metadata)) {
        switch (argsMetadata.type) {
          case requestArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? request : await argumentsResolution(request, argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case requestBodyArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? await request[argsMetadata.parser || "json"]() : await argumentsResolution(await request[argsMetadata.parser || "json"](), argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case contextArgsKey:
            args[argsMetadata.index] = !argsMetadata.key ? contextHook : contextHook.get(argsMetadata.key);
            break;
          case requestHeadersArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? request.headers : await argumentsResolution(request.headers.toJSON(), argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case responseHeadersArgsKey:
            args[argsMetadata.index] = context[argsMetadata.type];
            break;
          case requestHeaderArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? request.headers.get(argsMetadata.key) || undefined : await argumentsResolution(request.headers.get(argsMetadata.key) || undefined, argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case paramArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? context[paramsArgsKey][argsMetadata.key] || undefined : await argumentsResolution(context[paramsArgsKey][argsMetadata.key], argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case routeModelArgsKey:
            args[argsMetadata.index] = context[routeModelArgsKey];
            break;
          default:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? !(argsMetadata.type in context) ? undefined : context[argsMetadata.type] : await argumentsResolution(!(argsMetadata.type in context) ? undefined : context[argsMetadata.type], argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
        }
      }
    }
    context[responseBodyArgsKey] = await collection.func(...args);
    if (context[responseBodyArgsKey] instanceof Response) {
      return responseConverter(context[responseBodyArgsKey]);
    }
  }
  for (let i = 0;i < guardGroup.length; i++) {
    const args = [];
    const collection = guardGroup[i];
    const metadata = Reflect.getOwnMetadata(argumentsKey, collection.class, collection.funcName) || {};
    if (metadata) {
      for (const [_key, argsMetadata] of Object.entries(metadata)) {
        switch (argsMetadata.type) {
          case requestArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? request : await argumentsResolution(request, argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case requestBodyArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? await request[argsMetadata.parser || "json"]() : await argumentsResolution(await request[argsMetadata.parser || "json"](), argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case contextArgsKey:
            args[argsMetadata.index] = !argsMetadata.key ? contextHook : contextHook.get(argsMetadata.key);
            break;
          case requestHeadersArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? request.headers : await argumentsResolution(request.headers.toJSON(), argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case responseHeadersArgsKey:
            args[argsMetadata.index] = context[argsMetadata.type];
            break;
          case requestHeaderArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? request.headers.get(argsMetadata.key) || undefined : await argumentsResolution(request.headers.get(argsMetadata.key) || undefined, argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case paramArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? context[paramsArgsKey][argsMetadata.key] || undefined : await argumentsResolution(context[paramsArgsKey][argsMetadata.key], argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case routeModelArgsKey:
            args[argsMetadata.index] = context[routeModelArgsKey];
            break;
          default:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? context[argsMetadata.type] : await argumentsResolution(context[argsMetadata.type], argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
        }
      }
    }
    const guardResult = await collection.func(...args);
    if (typeof guardResult !== "boolean" || !guardResult) {
      throw new HttpClientError({
        httpCode: 401,
        message: "Unauthorization.",
        data: undefined
      });
    }
  }
  for (let i = 0;i < openDispatcherGroup.length; i++) {
    const args = [];
    const collection = openDispatcherGroup[i];
    const metadata = Reflect.getOwnMetadata(argumentsKey, collection.class, collection.funcName) || {};
    if (metadata) {
      for (const [_key, argsMetadata] of Object.entries(metadata)) {
        switch (argsMetadata.type) {
          case requestArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? request : await argumentsResolution(request, argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case requestBodyArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? await request[argsMetadata.parser || "json"]() : await argumentsResolution(await request[argsMetadata.parser || "json"](), argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case contextArgsKey:
            args[argsMetadata.index] = !argsMetadata.key ? contextHook : contextHook.get(argsMetadata.key);
            break;
          case requestHeadersArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? request.headers : await argumentsResolution(request.headers.toJSON(), argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case responseHeadersArgsKey:
            args[argsMetadata.index] = context[argsMetadata.type];
            break;
          case requestHeaderArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? request.headers.get(argsMetadata.key) || undefined : await argumentsResolution(request.headers.get(argsMetadata.key) || undefined, argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case paramArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? context[paramsArgsKey][argsMetadata.key] || undefined : await argumentsResolution(context[paramsArgsKey][argsMetadata.key], argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case routeModelArgsKey:
            args[argsMetadata.index] = context[routeModelArgsKey];
            break;
          default:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? context[argsMetadata.type] : await argumentsResolution(context[argsMetadata.type], argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
        }
      }
    }
    context[responseBodyArgsKey] = await collection.func(...args);
  }
  const controllerActionArguments = [];
  const controllerActionCollection = model;
  const controllerActionMetadata = Reflect.getOwnMetadata(argumentsKey, controllerActionCollection.class, controllerActionCollection.funcName) || {};
  if (controllerActionMetadata) {
    for (const [_key, argsMetadata] of Object.entries(controllerActionMetadata)) {
      switch (argsMetadata.type) {
        case requestArgsKey:
          controllerActionArguments[argsMetadata.index] = !argsMetadata.zodSchema ? request : await argumentsResolution(request, argsMetadata.zodSchema, argsMetadata.index, controllerActionCollection.funcName);
          break;
        case requestBodyArgsKey:
          controllerActionArguments[argsMetadata.index] = !argsMetadata.zodSchema ? await request[argsMetadata.parser || "json"]() : await argumentsResolution(await request[argsMetadata.parser || "json"](), argsMetadata.zodSchema, argsMetadata.index, controllerActionCollection.funcName);
          break;
        case contextArgsKey:
          controllerActionArguments[argsMetadata.index] = !argsMetadata.key ? contextHook : contextHook.get(argsMetadata.key);
          break;
        case requestHeadersArgsKey:
          controllerActionArguments[argsMetadata.index] = !argsMetadata.zodSchema ? request.headers : await argumentsResolution(request.headers.toJSON(), argsMetadata.zodSchema, argsMetadata.index, controllerActionCollection.funcName);
          break;
        case responseHeadersArgsKey:
          controllerActionArguments[argsMetadata.index] = context[argsMetadata.type];
          break;
        case requestHeaderArgsKey:
          controllerActionArguments[argsMetadata.index] = !argsMetadata.zodSchema ? request.headers.get(argsMetadata.key) || undefined : await argumentsResolution(request.headers.get(argsMetadata.key) || undefined, argsMetadata.zodSchema, argsMetadata.index, controllerActionCollection.funcName);
          break;
        case paramArgsKey:
          controllerActionArguments[argsMetadata.index] = !argsMetadata.zodSchema ? context[paramsArgsKey][argsMetadata.key] || undefined : await argumentsResolution(context[paramsArgsKey][argsMetadata.key], argsMetadata.zodSchema, argsMetadata.index, controllerActionCollection.funcName);
          break;
        case routeModelArgsKey:
          controllerActionArguments[argsMetadata.index] = context[routeModelArgsKey];
          break;
        default:
          controllerActionArguments[argsMetadata.index] = !argsMetadata.zodSchema ? context[argsMetadata.type] : await argumentsResolution(context[argsMetadata.type], argsMetadata.zodSchema, argsMetadata.index, controllerActionCollection.funcName);
          break;
      }
    }
  }
  context[responseBodyArgsKey] = await controllerActionCollection.func(...controllerActionArguments);
  for (let i = 0;i < closeDispatcherGroup.length; i++) {
    const args = [];
    const collection = closeDispatcherGroup[i];
    const metadata = Reflect.getOwnMetadata(argumentsKey, collection.class, collection.funcName) || {};
    if (metadata) {
      for (const [_key, argsMetadata] of Object.entries(metadata)) {
        switch (argsMetadata.type) {
          case requestArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? request : await argumentsResolution(request, argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case requestBodyArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? await request[argsMetadata.parser || "json"]() : await argumentsResolution(await request[argsMetadata.parser || "json"](), argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case contextArgsKey:
            args[argsMetadata.index] = !argsMetadata.key ? contextHook : contextHook.get(argsMetadata.key);
            break;
          case requestHeadersArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? request.headers : await argumentsResolution(request.headers.toJSON(), argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case responseHeadersArgsKey:
            args[argsMetadata.index] = context[argsMetadata.type];
            break;
          case requestHeaderArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? request.headers.get(argsMetadata.key) || undefined : await argumentsResolution(request.headers.get(argsMetadata.key) || undefined, argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case paramArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? context[paramsArgsKey][argsMetadata.key] || undefined : await argumentsResolution(context[paramsArgsKey][argsMetadata.key], argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case routeModelArgsKey:
            args[argsMetadata.index] = context[routeModelArgsKey];
            break;
          default:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? context[argsMetadata.type] : await argumentsResolution(context[argsMetadata.type], argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
        }
      }
    }
    await collection.func(...args);
  }
  if (context[responseBodyArgsKey] instanceof Response) {
    return responseConverter(context[responseBodyArgsKey]);
  }
  for (let i = 0;i < endMiddlewareGroup.length; i++) {
    const args = [];
    const collection = endMiddlewareGroup[i];
    const metadata = Reflect.getOwnMetadata(argumentsKey, collection.class, collection.funcName) || {};
    if (metadata) {
      for (const [_key, argsMetadata] of Object.entries(metadata)) {
        switch (argsMetadata.type) {
          case requestArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? request : await argumentsResolution(request, argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case requestBodyArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? await request[argsMetadata.parser || "json"]() : await argumentsResolution(await request[argsMetadata.parser || "json"](), argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case contextArgsKey:
            args[argsMetadata.index] = !argsMetadata.key ? contextHook : contextHook.get(argsMetadata.key);
            break;
          case requestHeadersArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? request.headers : await argumentsResolution(request.headers.toJSON(), argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case responseHeadersArgsKey:
            args[argsMetadata.index] = context[argsMetadata.type];
            break;
          case requestHeaderArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? request.headers.get(argsMetadata.key) || undefined : await argumentsResolution(request.headers.get(argsMetadata.key) || undefined, argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case paramArgsKey:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? context[paramsArgsKey][argsMetadata.key] || undefined : await argumentsResolution(context[paramsArgsKey][argsMetadata.key], argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
          case routeModelArgsKey:
            args[argsMetadata.index] = context[routeModelArgsKey];
            break;
          default:
            args[argsMetadata.index] = !argsMetadata.zodSchema ? !(argsMetadata.type in context) ? undefined : context[argsMetadata.type] : await argumentsResolution(!(argsMetadata.type in context) ? undefined : context[argsMetadata.type], argsMetadata.zodSchema, argsMetadata.index, collection.funcName);
            break;
        }
      }
    }
    context[responseBodyArgsKey] = await collection.func(...args);
    if (context[responseBodyArgsKey] instanceof Response) {
      return responseConverter(context[responseBodyArgsKey]);
    }
  }
  return responseConverter(new Response(!context[responseBodyArgsKey] ? undefined : JSON.stringify({
    httpCode: 200,
    message: "SUCCESS",
    data: context[responseBodyArgsKey]
  }), {
    status: !context[responseBodyArgsKey] ? 204 : 200,
    statusText: "SUCCESS",
    headers: context[responseHeadersArgsKey]
  }));
};
var BoolFactory = async (modules, options) => {
  try {
    const staticMap = new Map;
    const modulesConverted = !Array.isArray(modules) ? [modules] : modules;
    const {
      allowLogsMethods,
      staticOption,
      allowOrigins,
      allowMethods,
      allowCredentials,
      allowHeaders
    } = Object.freeze({
      allowLogsMethods: options?.log?.methods,
      staticOption: options.static,
      allowOrigins: !options.cors?.origins ? ["*"] : typeof options.cors.origins !== "string" ? options.cors.origins.includes("*") || options.cors.origins.length < 1 ? ["*"] : options.cors.origins : [options.cors.origins !== "*" ? options.cors.origins : "*"],
      allowMethods: options.cors?.methods || [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS"
      ],
      allowCredentials: !options.cors?.credentials ? false : true,
      allowHeaders: !options.cors?.headers || options.cors.headers.includes("*") ? ["*"] : options.cors.headers
    });
    const moduleResolutions = await Promise.all(modulesConverted.map((moduleConverted) => moduleResolution(moduleConverted, options)));
    const availableModuleResolutions = moduleResolutions.filter((moduleResolution2) => typeof moduleResolution2 !== "undefined");
    const prefixs = [
      ...new Set(availableModuleResolutions.map((availableModuleResolution) => availableModuleResolution.prefix))
    ];
    if (prefixs.length !== availableModuleResolutions.length) {
      throw Error("Module prefix should be unique.");
    }
    const webSocketsMap = new Map;
    for (const availableModuleResolution of availableModuleResolutions) {
      const webSocketMap = availableModuleResolution.webSocketRouterGroup.execute();
      for (const [key, metadata] of webSocketMap.entries()) {
        webSocketsMap.set(key, metadata);
      }
    }
    const server = Bun.serve({
      port: options.port,
      fetch: async (request, server2) => {
        const start = performance.now();
        const url = new URL(request.url);
        const query = import_qs.default.parse(url.searchParams.toString(), options.queryParser);
        const origin = request.headers.get("origin") || "*";
        const method = request.method.toUpperCase();
        const responseHeaders = new Headers;
        try {
          const isUpgradable = isWebSocketUpgrade(request);
          let collection;
          if (isUpgradable) {
            for (const availableModuleResolution of availableModuleResolutions) {
              const routeResult = availableModuleResolution.webSocketHttpRouterGroup.find(url.pathname, request.method);
              if (routeResult) {
                collection = Object.freeze({
                  route: routeResult,
                  resolution: availableModuleResolution
                });
                break;
              }
            }
            if (!collection) {
              return responseConverter(new Response(JSON.stringify({
                httpCode: 404,
                message: "Route not found",
                data: undefined
              }), {
                status: 404,
                statusText: "Not found.",
                headers: responseHeaders
              }));
            }
            const upgradeResult = await webSocketFetcher({
              request,
              server: server2
            }, {
              query,
              responseHeaders,
              route: collection.route,
              moduleResolution: collection.resolution
            });
            return upgradeResult instanceof Response ? upgradeResult : undefined;
          }
          allowCredentials && responseHeaders.set("Access-Control-Allow-Credentials", "true");
          responseHeaders.set("Access-Control-Allow-Methods", allowMethods.join(", "));
          responseHeaders.set("Access-Control-Allow-Headers", allowHeaders.join(", "));
          responseHeaders.set("Access-Control-Allow-Origin", allowOrigins.includes("*") ? "*" : !allowOrigins.includes(origin) ? allowOrigins[0] : origin);
          if (!allowMethods.includes(method)) {
            return responseConverter(new Response(undefined, {
              status: 405,
              statusText: "Method Not Allowed.",
              headers: responseHeaders
            }));
          }
          if (request.method.toUpperCase() === "OPTIONS") {
            return responseConverter(allowOrigins.includes("*") || allowOrigins.includes(origin) ? new Response(undefined, {
              status: 204,
              statusText: "No Content.",
              headers: responseHeaders
            }) : new Response(undefined, {
              status: 417,
              statusText: "Expectation Failed.",
              headers: responseHeaders
            }));
          }
          if (staticOption) {
            const { path, headers, cacheTimeInSeconds } = staticOption;
            const pathname = `${path}/${url.pathname}`;
            const cachedFile = staticMap.get(pathname);
            if (!cachedFile) {
              const file = Bun.file(pathname);
              const isFileExists = await file.exists();
              if (isFileExists) {
                if (headers) {
                  for (const [key, value] of Object.entries(headers)) {
                    responseHeaders.set(key, value);
                  }
                }
                responseHeaders.set("Content-Type", file.type);
                return responseConverter(new Response(await file.arrayBuffer(), {
                  status: 200,
                  statusText: "SUCCESS",
                  headers: responseHeaders
                }));
              }
            } else {
              const isExpired = new Date > cachedFile.expiredAt;
              if (isExpired) {
                staticMap.delete(pathname);
              }
              const file = !isExpired ? cachedFile.file : Bun.file(pathname);
              const isFileExists = await file.exists();
              if (isFileExists) {
                staticMap.set(pathname, Object.freeze({
                  expiredAt: add(new Date, typeof cacheTimeInSeconds !== "number" ? DEFAULT_STATIC_CACHE_TIME_IN_SECONDS : cacheTimeInSeconds, ETimeUnit.seconds),
                  file
                }));
                if (headers) {
                  for (const [key, value] of Object.entries(headers)) {
                    responseHeaders.set(key, value);
                  }
                }
                responseHeaders.set("Content-Type", file.type);
                return responseConverter(new Response(await file.arrayBuffer(), {
                  status: 200,
                  statusText: "SUCCESS",
                  headers: responseHeaders
                }));
              }
            }
          }
          for (const availableModuleResolution of availableModuleResolutions) {
            const routeResult = availableModuleResolution.controllerRouterGroup.find(url.pathname, request.method);
            if (routeResult) {
              collection = Object.freeze({
                route: routeResult,
                resolution: availableModuleResolution
              });
              break;
            }
          }
          if (!collection) {
            return responseConverter(new Response(JSON.stringify({
              httpCode: 404,
              message: "Route not found",
              data: undefined
            }), {
              status: 404,
              statusText: "Not found.",
              headers: responseHeaders
            }));
          }
          return await httpFetcher({
            request,
            server: server2
          }, {
            query,
            responseHeaders,
            route: collection.route,
            moduleResolution: collection.resolution
          });
        } catch (error) {
          options.debug && console.error(error);
          return responseConverter(jsonErrorInfer(error, responseHeaders));
        } finally {
          if (allowLogsMethods) {
            const end = performance.now();
            const pathname = ansiText(url.pathname, { color: "blue" });
            const convertedPID = `${Bun.color("yellow", "ansi")}${process.pid}`;
            const convertedMethod = ansiText(request.method, {
              color: "yellow",
              backgroundColor: "blue"
            });
            const convertedReqIp = ansiText(`${request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || server2.requestIP(request)?.address || "<Unknown>"}`, {
              color: "yellow"
            });
            const convertedTime = ansiText(`${Math.round((end - start + Number.EPSILON) * 10 ** 2) / 10 ** 2}ms`, {
              color: "yellow",
              backgroundColor: "blue"
            });
            allowLogsMethods.includes(request.method.toUpperCase()) && console.info(`PID: ${convertedPID} - Method: ${convertedMethod} - IP: ${convertedReqIp} - ${pathname} - Time: ${convertedTime}`);
          }
        }
      },
      websocket: {
        open: (connection) => {
          const pathnameKey = `${connection.data.pathname}:::open`;
          const handlerMetadata = webSocketsMap.get(pathnameKey);
          if (!handlerMetadata) {
            return;
          }
          const argumentsMetadata = handlerMetadata.arguments || {};
          const args = [];
          for (const [_key, argumentMetadata] of Object.entries(argumentsMetadata)) {
            switch (argumentMetadata.type) {
              case webSocketConnectionArgsKey:
                args[argumentMetadata.index] = connection;
                break;
              case webSocketServerArgsKey:
                args[argumentMetadata.index] = server;
                break;
            }
          }
          handlerMetadata.descriptor.value(...args);
        },
        close: (connection, code, reason) => {
          const pathnameKey = `${connection.data.pathname}:::close`;
          const handlerMetadata = webSocketsMap.get(pathnameKey);
          if (!handlerMetadata) {
            return;
          }
          const argumentsMetadata = handlerMetadata.arguments || {};
          const args = [];
          for (const [_key, argumentMetadata] of Object.entries(argumentsMetadata)) {
            switch (argumentMetadata.type) {
              case webSocketConnectionArgsKey:
                args[argumentMetadata.index] = connection;
                break;
              case webSocketServerArgsKey:
                args[argumentMetadata.index] = server;
                break;
              case webSocketCloseCodeArgsKey:
                args[argumentMetadata.index] = code;
                break;
              case webSocketCloseReasonArgsKey:
                args[argumentMetadata.index] = reason;
                break;
            }
          }
          handlerMetadata.descriptor.value(...args);
        },
        message: (connection, message) => {
          const pathnameKey = `${connection.data.pathname}:::message`;
          const handlerMetadata = webSocketsMap.get(pathnameKey);
          if (!handlerMetadata) {
            return;
          }
          const argumentsMetadata = handlerMetadata.arguments || {};
          const args = [];
          for (const [_key, argumentMetadata] of Object.entries(argumentsMetadata)) {
            switch (argumentMetadata.type) {
              case webSocketConnectionArgsKey:
                args[argumentMetadata.index] = connection;
                break;
              case webSocketMessageArgsKey:
                args[argumentMetadata.index] = message;
                break;
              case webSocketServerArgsKey:
                args[argumentMetadata.index] = server;
                break;
            }
          }
          handlerMetadata.descriptor.value(...args);
        },
        drain: (connection) => {
          const pathnameKey = `${connection.data.pathname}:::drain`;
          const handlerMetadata = webSocketsMap.get(pathnameKey);
          if (!handlerMetadata) {
            return;
          }
          const argumentsMetadata = handlerMetadata.arguments || {};
          const args = [];
          for (const [_key, argumentMetadata] of Object.entries(argumentsMetadata)) {
            switch (argumentMetadata.type) {
              case webSocketConnectionArgsKey:
                args[argumentMetadata.index] = connection;
                break;
              case webSocketServerArgsKey:
                args[argumentMetadata.index] = server;
                break;
            }
          }
          handlerMetadata.descriptor.value(...args);
        },
        ping: (connection, data) => {
          const pathnameKey = `${connection.data.pathname}:::ping`;
          const handlerMetadata = webSocketsMap.get(pathnameKey);
          if (!handlerMetadata) {
            return;
          }
          const argumentsMetadata = handlerMetadata.arguments || {};
          const args = [];
          for (const [_key, argumentMetadata] of Object.entries(argumentsMetadata)) {
            switch (argumentMetadata.type) {
              case webSocketConnectionArgsKey:
                args[argumentMetadata.index] = connection;
                break;
              case webSocketServerArgsKey:
                args[argumentMetadata.index] = server;
                break;
              case webSocketMessageArgsKey:
                args[argumentMetadata.index] = data;
                break;
            }
          }
          handlerMetadata.descriptor.value(...args);
        },
        pong: (connection, data) => {
          const pathnameKey = `${connection.data.pathname}:::pong`;
          const handlerMetadata = webSocketsMap.get(pathnameKey);
          if (!handlerMetadata) {
            return;
          }
          const argumentsMetadata = handlerMetadata.arguments || {};
          const args = [];
          for (const [_key, argumentMetadata] of Object.entries(argumentsMetadata)) {
            switch (argumentMetadata.type) {
              case webSocketConnectionArgsKey:
                args[argumentMetadata.index] = connection;
                break;
              case webSocketServerArgsKey:
                args[argumentMetadata.index] = server;
                break;
              case webSocketMessageArgsKey:
                args[argumentMetadata.index] = data;
                break;
            }
          }
          handlerMetadata.descriptor.value(...args);
        }
      }
    });
  } catch (error) {
    options.debug && console.error(error);
    throw error;
  }
};
export {
  jsonErrorInfer,
  httpServerErrors,
  httpClientErrors,
  ZodSchema,
  WebSocketServer,
  WebSocketEvent,
  WebSocketConnection,
  WebSocketCloseReason,
  WebSocketCloseCode,
  WebSocket2 as WebSocket,
  RouteModel,
  ResponseHeaders,
  RequestHeaders,
  RequestHeader,
  RequestBody,
  Request,
  Query,
  Put,
  Post,
  Patch,
  Params,
  Param,
  Options,
  Module,
  Middleware,
  exports_keys as Keys,
  Injector,
  Injectable,
  Inject,
  HttpServerError,
  HttpClientError,
  Guard,
  Get,
  Dispatcher,
  Delete,
  Controller,
  Context,
  BoolFactory
};
