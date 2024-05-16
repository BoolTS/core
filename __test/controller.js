var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Delete, Get, Inject, Options, Patch, Post, Put } from "../src";
import { TestService } from "./service";
let TestController = class TestController {
    testService;
    constructor(testService) {
        this.testService = testService;
    }
    _get(req, res) {
        res.json({ test: "success" }).send();
    }
    _post(req, res) {
        console.log("req.body", req.body);
        res.json({ test: "success" }).send();
    }
    _put(req, res) {
        res.json({ test: "success" }).send();
    }
    _patch(req, res) {
        res.json({ test: "success" }).send();
    }
    _delete(req, res) {
        res.json({ test: "success" }).send();
    }
    _options(req, res) {
        res.json({ test: "success" }).send();
    }
};
__decorate([
    Get()
], TestController.prototype, "_get", null);
__decorate([
    Post()
], TestController.prototype, "_post", null);
__decorate([
    Put()
], TestController.prototype, "_put", null);
__decorate([
    Patch()
], TestController.prototype, "_patch", null);
__decorate([
    Delete()
], TestController.prototype, "_delete", null);
__decorate([
    Options()
], TestController.prototype, "_options", null);
TestController = __decorate([
    Controller("test"),
    __param(0, Inject(TestService))
], TestController);
export { TestController };
