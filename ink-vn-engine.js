(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.InkVN = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Pizzicato = (typeof window !== "undefined" ? window['Pizzicato'] : typeof global !== "undefined" ? global['Pizzicato'] : null);
class AudioFactory {
    static Create() {
        if (Pizzicato != null) {
            return new PizzicatoAudio();
        }
        else {
            return new DummyAudio();
        }
    }
}
exports.AudioFactory = AudioFactory;
class Audio {
}
exports.Audio = Audio;
class PizzicatoAudio extends Audio {
    PlayBGM(bgmURL) {
        if (bgmURL !== this.bgmURL) {
            this.bgmURL = bgmURL;
            const bgm = new Pizzicato.Sound({
                options: {
                    loop: true,
                    path: bgmURL
                },
                source: "file"
            }, () => {
                if (this.bgm != null) {
                    this.bgm.stop();
                    this.bgm.disconnect();
                }
                bgm.play();
                this.bgm = bgm;
            });
        }
    }
    PlaySFX(sfxURL) {
        const sfx = new Pizzicato.Sound({
            options: { path: sfxURL },
            source: "file"
        }, () => sfx.play());
    }
    StopBGM() {
        if (this.bgm != null) {
            this.bgm.stop();
            this.bgm.disconnect();
            this.bgmURL = null;
            this.bgm = null;
        }
    }
}
class DummyAudio extends Audio {
    PlayBGM(bgmURL) { }
    PlaySFX(sfxURL) { }
    StopBGM() { }
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("./events");
const point_1 = require("./point");
class Canvas {
    constructor(containerID, size) {
        this._onClick = new events_1.LiteEvent();
        this._onMove = new events_1.LiteEvent();
        const container = document.getElementById(containerID);
        if (container.tagName === "canvas") {
            this.element = container;
        }
        else {
            this.element = document.createElement("canvas");
            container.appendChild(this.element);
        }
        this.element.width = size.X;
        this.element.height = size.Y;
        this.ctx = this.element.getContext("2d");
        if (!this.ctx) {
        }
        this.element.addEventListener("click", this._click.bind(this));
        this.element.addEventListener("mousemove", this._move.bind(this));
        this.Clear();
    }
    get Size() {
        return new point_1.Point(this.element.width, this.element.height);
    }
    set Size(size) {
        this.element.width = size.X;
        this.element.height = size.Y;
    }
    Clear() {
        this.ctx.clearRect(0, 0, this.element.width, this.element.height);
    }
    DrawBackgroundImage(image) {
        this.ctx.drawImage(image, 0, 0, this.element.width, this.element.height);
    }
    DrawImage(image, position) {
        this.ctx.drawImage(image, position.X, position.Y, image.width, image.height);
    }
    DrawImageTo(image, source, destination) {
        this.ctx.drawImage(image, source.Position.X, source.Position.Y, source.Size.X, source.Size.Y, destination.Position.X, destination.Position.Y, destination.Size.X, destination.Size.Y);
    }
    DrawRect(position, size, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(position.X, position.Y, size.X, size.Y);
    }
    DrawRect0(size, color) {
        this.DrawRect(new point_1.Point(), size, color);
    }
    DrawText(text, position, color, fontSize, maxWidth) {
        this.ctx.fillStyle = color;
        this.ctx.font = `${fontSize}px sans-serif`;
        this.ctx.textBaseline = "top";
        this.ctx.fillText(text, position.X, position.Y, maxWidth);
    }
    DrawText0(text, color, fontSize, maxWidth) {
        this.DrawText(text, new point_1.Point(), color, fontSize, maxWidth);
    }
    GetImageData() {
        return this.ctx.getImageData(0, 0, this.Size.X, this.Size.Y);
    }
    MeasureTextWidth(text) {
        // We measure with the last font used in the context
        return this.ctx.measureText(text).width;
    }
    Restore() {
        this.ctx.restore();
    }
    SetCursor(cursor) {
        this.element.style.cursor = cursor;
    }
    Translate(position) {
        this.Restore();
        this.ctx.save();
        this.ctx.translate(position.X, position.Y);
    }
    get OnClick() {
        return this._onClick.Expose();
    }
    get OnMove() {
        return this._onMove.Expose();
    }
    _click(ev) {
        ev.preventDefault();
        this._onClick.Trigger(this, new point_1.Point(ev.pageX - this.element.offsetLeft, ev.pageY - this.element.offsetTop));
    }
    _move(ev) {
        this._onMove.Trigger(this, new point_1.Point(ev.pageX - this.element.offsetLeft, ev.pageY - this.element.offsetTop));
    }
}
exports.Canvas = Canvas;
class HiddenCanvas extends Canvas {
    constructor(size) {
        const id = `c_${Math.random().toString().slice(2, 7)}`;
        const hiddenElement = document.createElement("div");
        hiddenElement.id = id;
        document.body.appendChild(hiddenElement);
        super(id, size);
        this.hiddenElement = hiddenElement;
    }
    Destroy() {
        this.hiddenElement.remove();
    }
}
exports.HiddenCanvas = HiddenCanvas;
},{"./events":4,"./point":14}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_1 = require("./point");
class ClassConfig {
    constructor() {
        this.DefaultTextSpeed = 30;
        this.ScreenSize = new point_1.Point(800, 600);
        this.TextSpeed = this.DefaultTextSpeed; // This is in char per second
    }
    Load(tags) {
        function error(tag) {
            console.error(`Error reading tag: "${tag}"`);
        }
        for (let i = 0; i < tags.length; ++i) {
            let key, value;
            try {
                key = tags[i].split(":")[0].trim();
                value = tags[i].split(":")[1].trim();
            }
            catch (e) {
                if (e instanceof TypeError) {
                    error(tags[i]);
                    continue;
                }
            }
            try {
                switch (key) {
                    case "screen_size":
                    case "screensize": {
                        const size = value.split(/\D+/).map(x => parseInt(x, 10));
                        if (size.length === 2 && !isNaN(size[0]) && !isNaN(size[1])) {
                            this.ScreenSize = new point_1.Point(size[0], size[1]);
                        }
                        else {
                            throw new TypeError();
                        }
                        break;
                    }
                    case "text_speed":
                    case "textspeed": {
                        const speed = parseInt(value, 10);
                        if (!isNaN(speed)) {
                            this.DefaultTextSpeed = this.TextSpeed = speed;
                        }
                        else {
                            throw new TypeError();
                        }
                        break;
                    }
                }
            }
            catch (e) {
                if (e instanceof TypeError) {
                    error(tags[i]);
                }
            }
        }
    }
    get TextSpeed() {
        return this.textSpeed;
    }
    set TextSpeed(value) {
        this.textSpeed = value;
        this.textSpeedRatio = 1000.0 / this.textSpeed;
    }
    get TextSpeedRatio() {
        return this.textSpeedRatio;
    }
}
exports.Config = new ClassConfig();
},{"./point":14}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LiteEvent {
    constructor() {
        this.handlers = [];
    }
    Expose() {
        return this;
    }
    Off(handler) {
        this.handlers = this.handlers.filter(_handler => _handler !== handler);
    }
    On(handler) {
        this.handlers.push(handler);
    }
    Trigger(sender, args) {
        this.handlers.forEach(handler => handler(sender, args));
    }
}
exports.LiteEvent = LiteEvent;
},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loader_1 = require("../loader");
const layers_1 = require("./layers");
class Background extends layers_1.Layer {
    constructor(imageURL) {
        super();
        if (imageURL != null) {
            this.BackgroundImage = imageURL;
        }
    }
    set BackgroundImage(imageURL) {
        if (imageURL !== this.backgroundImageURL) {
            this.backgroundImageURL = imageURL;
            loader_1.Loader.LoadImage(imageURL).then(image => {
                this.backgroundImage = image;
            });
        }
    }
    Draw(canvas) {
        if (this.backgroundImage != null) {
            canvas.DrawBackgroundImage(this.backgroundImage);
        }
    }
}
exports.Background = Background;
},{"../loader":12,"./layers":9}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("../canvas");
const loader_1 = require("../loader");
const point_1 = require("../point");
const layers_1 = require("./layers");
var BoxBackgroundTypes;
(function (BoxBackgroundTypes) {
    BoxBackgroundTypes[BoxBackgroundTypes["COLOR"] = 0] = "COLOR";
    BoxBackgroundTypes[BoxBackgroundTypes["NINEPATCH"] = 1] = "NINEPATCH";
    BoxBackgroundTypes[BoxBackgroundTypes["STRETCH"] = 2] = "STRETCH";
})(BoxBackgroundTypes = exports.BoxBackgroundTypes || (exports.BoxBackgroundTypes = {}));
class ClassBoxBackgroundFactory {
    Create(type, background, size, position) {
        switch (type) {
            case BoxBackgroundTypes.COLOR: {
                return new ColoredBoxBackground(background, size, position);
            }
            case BoxBackgroundTypes.NINEPATCH: {
                return new NinePatchBoxBackground(background, size, position);
            }
            case BoxBackgroundTypes.STRETCH: {
                return new StretchBoxBackground(background, size, position);
            }
        }
    }
}
exports.BoxBackgroundFactory = new ClassBoxBackgroundFactory();
class BoxBackground extends layers_1.Layer {
    constructor(size, position) {
        super();
        this.box = {
            Position: position == null ? new point_1.Point() : position,
            Size: size
        };
    }
    set Position(position) {
        this.box.Position = position;
    }
    set Size(size) {
        this.box.Size = size;
    }
}
exports.BoxBackground = BoxBackground;
class ColoredBoxBackground extends BoxBackground {
    constructor(color, size, position) {
        super(size, position);
        this.Color = color;
    }
    Draw(canvas) {
        canvas.DrawRect(this.box.Position, this.box.Size, this.Color);
    }
}
class NinePatchBoxBackground extends BoxBackground {
    constructor(ninePatchURL, size, position) {
        super(size, position);
        this.NinePatch = ninePatchURL;
    }
    set NinePatch(ninePatchURL) {
        if (ninePatchURL !== this.ninePatchURL) {
            this.ninePatchURL = ninePatchURL;
            loader_1.Loader.LoadImage(ninePatchURL)
                .then(image => {
                const hiddenCanvas = new canvas_1.HiddenCanvas(this.box.Size.Clone());
                const patchSize = new point_1.Point(image.width / 3, image.height / 3);
                function drawPatchTo(patchPosition, destPos, destSize) {
                    hiddenCanvas.DrawImageTo(image, { Position: patchPosition, Size: patchSize }, { Position: destPos, Size: destSize != null ? destSize : patchSize });
                }
                const patchDestinations = [
                    new point_1.Point(), new point_1.Point(this.box.Size.X - patchSize.X, 0),
                    new point_1.Point(0, this.box.Size.Y - patchSize.Y),
                    new point_1.Point(this.box.Size.X - patchSize.X, this.box.Size.Y - patchSize.Y)
                ];
                drawPatchTo(new point_1.Point(), patchDestinations[0]); // Upper Left
                drawPatchTo(patchSize.Mult(new point_1.Point(2, 0)), patchDestinations[1]); // Upper Right
                drawPatchTo(patchSize.Mult(new point_1.Point(0, 2)), patchDestinations[2]); // Lower Left
                drawPatchTo(patchSize.Mult(new point_1.Point(2, 2)), patchDestinations[3]); // Lower Right
                drawPatchTo(patchSize.Mult(new point_1.Point(1, 0)), patchSize.Mult(new point_1.Point(1, 0)), new point_1.Point(this.box.Size.X - (patchSize.X * 2), patchSize.Y)); // Top
                drawPatchTo(patchSize.Mult(new point_1.Point(2, 1)), patchDestinations[1].Add(new point_1.Point(0, patchSize.Y)), new point_1.Point(patchSize.X, this.box.Size.Y - (patchSize.Y * 2))); // Right
                drawPatchTo(patchSize.Mult(new point_1.Point(1, 2)), patchDestinations[2].Add(new point_1.Point(patchSize.X, 0)), new point_1.Point(this.box.Size.X - (patchSize.X * 2), patchSize.Y)); // Bottom
                drawPatchTo(patchSize.Mult(new point_1.Point(0, 1)), patchSize.Mult(new point_1.Point(0, 1)), new point_1.Point(patchSize.X, this.box.Size.Y - (patchSize.Y * 2))); // Left
                drawPatchTo(patchSize.Mult(new point_1.Point(1, 1)), patchSize.Mult(new point_1.Point(1, 1)), this.box.Size.Sub(patchSize.Mult(new point_1.Point(2, 2)))); // Center
                createImageBitmap(hiddenCanvas.GetImageData()).then(ninePatchImage => {
                    this.ninePatch = ninePatchImage;
                    // hiddenCanvas.Destroy();
                });
            });
        }
    }
    Draw(canvas) {
        if (this.ninePatch != null) {
            canvas.DrawImage(this.ninePatch, this.box.Position);
        }
    }
}
class StretchBoxBackground extends BoxBackground {
    constructor(imageURL, size, position) {
        super(size, position);
        this.Image = imageURL;
    }
    set Image(imageURL) {
        if (imageURL !== this.imageURL) {
            this.imageURL = imageURL;
            loader_1.Loader.LoadImage(imageURL)
                .then(image => {
                this.image = image;
                this.imageSize = new point_1.Point(this.image.width, this.image.height);
            });
        }
    }
    Draw(canvas) {
        if (this.image != null) {
            canvas.DrawImageTo(this.image, { Position: new point_1.Point(), Size: this.imageSize }, { Position: this.box.Position, Size: this.box.Size });
        }
    }
}
},{"../canvas":2,"../loader":12,"../point":14,"./layers":9}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loader_1 = require("../loader");
const point_1 = require("../point");
const layers_1 = require("./layers");
class Character extends layers_1.Layer {
    constructor(spriteURL, posX) {
        super();
        this.centerPosX = posX;
        this.Sprite = spriteURL;
    }
    set Sprite(spriteURL) {
        if (spriteURL !== this.spriteURL) {
            this.spriteURL = spriteURL;
            loader_1.Loader.LoadImage(spriteURL).then(image => this.sprite = image);
        }
    }
    Draw(canvas) {
        if (this.sprite != null) {
            if (this.position == null) {
                this.position = new point_1.Point(this.centerPosX - (this.sprite.width / 2), canvas.Size.Y - this.sprite.height);
            }
            canvas.DrawImage(this.sprite, this.position);
        }
    }
}
class Characters extends layers_1.Layer {
    constructor() {
        super();
        this.characters = [];
    }
    Add(spriteURL, canvas) {
        // For now just handle one character at a time
        if (this.characters.length > 0) {
            this.characters = [];
        }
        this.characters.push(new Character(spriteURL, canvas.Size.X / 2));
    }
    Draw(canvas) {
        for (const character of this.characters) {
            character.Draw(canvas);
        }
    }
    Remove() {
        this.characters = [];
    }
}
exports.Characters = Characters;
},{"../loader":12,"../point":14,"./layers":9}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_1 = require("../point");
const boxbackgrounds_1 = require("./boxbackgrounds");
const layers_1 = require("./layers");
class ChoiceBox {
    constructor(id, text, width, position) {
        this.fontSize = 24;
        this.hasAlreadyBeenDrawnOnce = false;
        this.innerMargin = new point_1.Point(0, 20);
        this.id = id;
        this.text = text;
        this.size = new point_1.Point(width, (this.fontSize * 1.42857) + (2 * this.innerMargin.Y));
        this.position = position;
        this.boxBackground = boxbackgrounds_1.BoxBackgroundFactory.Create(boxbackgrounds_1.BoxBackgroundTypes.COLOR, "rgba(0, 0, 0, .7)", this.size, this.position);
    }
    get Id() {
        return this.id;
    }
    get BoundingRect() {
        return {
            Position: this.position,
            Size: this.size
        };
    }
    Draw(canvas) {
        if (!this.hasAlreadyBeenDrawnOnce) {
            this.beforeFirstDraw(canvas);
        }
        this.boxBackground.Draw(canvas);
        canvas.DrawText(this.text, this.position.Add(this.innerMargin), "white", this.fontSize, this.size.X);
    }
    beforeFirstDraw(canvas) {
        canvas.DrawText0("", "transparent", this.fontSize);
        this.innerMargin.X = (this.size.X - canvas.MeasureTextWidth(this.text)) / 2;
    }
}
class ChoiceLayer extends layers_1.GameplayLayer {
    constructor(screenSize) {
        super();
        this.choiceBoxes = [];
        this.choices = [];
        this.isMouseOnChoice = null;
        this.screenSize = screenSize;
    }
    set Choices(choices) {
        this.choices = choices;
        this.choiceBoxes = [];
        const width = 200;
        const position = new point_1.Point(0, 0);
        for (const _choice of this.choices) {
            const newChoice = new ChoiceBox(_choice.index, _choice.text, width, position.Clone());
            this.choiceBoxes.push(newChoice);
            position.Y += newChoice.BoundingRect.Size.Y + 40;
        }
        this.boundingRect = new point_1.Point(width, position.Y - 40);
        this.translation = this.screenSize.Div(new point_1.Point(2)).Sub(this.boundingRect.Div(new point_1.Point(2)));
    }
    Draw(canvas) {
        canvas.Translate(this.translation);
        for (const choiceBox of this.choiceBoxes) {
            choiceBox.Draw(canvas);
        }
        canvas.Restore();
    }
    MouseClick(clickPosition, action) {
        for (const choiceBox of this.choiceBoxes) {
            const boundingRect = choiceBox.BoundingRect;
            boundingRect.Position = boundingRect.Position.Add(this.translation);
            if (clickPosition.IsInRect(boundingRect)) {
                action(choiceBox.Id);
                break;
            }
        }
    }
    MouseMove(mousePosition) {
        mousePosition = mousePosition.Sub(this.translation);
        if (this.isMouseOnChoice != null) {
            return mousePosition.IsInRect(this.isMouseOnChoice.BoundingRect) ? null : (canvas) => {
                canvas.SetCursor("default");
                this.isMouseOnChoice = null;
            };
        }
        else {
            for (const choice of this.choiceBoxes) {
                if (mousePosition.IsInRect(choice.BoundingRect)) {
                    return (canvas) => {
                        this.isMouseOnChoice = choice;
                        canvas.SetCursor("pointer");
                    };
                }
            }
        }
        return null;
    }
    Step(delta) { }
}
exports.ChoiceLayer = ChoiceLayer;
},{"../point":14,"./boxbackgrounds":6,"./layers":9}],9:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
class Layer {
}
exports.Layer = Layer;
class StepLayer extends Layer {
}
exports.StepLayer = StepLayer;
class GameplayLayer extends StepLayer {
}
exports.GameplayLayer = GameplayLayer;
__export(require("./background"));
__export(require("./characters"));
__export(require("./choicelayer"));
__export(require("./speechlayer"));
__export(require("./transition"));
},{"./background":5,"./characters":7,"./choicelayer":8,"./speechlayer":10,"./transition":11}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_1 = require("../point");
const boxbackgrounds_1 = require("./boxbackgrounds");
const layers_1 = require("./layers");
const config_1 = require("../config");
const REWRAP_THIS_LINE = "<[{REWRAP_THIS_LINE}]>";
class SpeechBox {
    constructor(position, size, configuration) {
        this.textLines = [""];
        this.position = position.Clone();
        this.size = size.Clone();
        this.innerMargin = configuration.InnerMargin;
        this.innerSize = this.size.Sub(this.innerMargin.Mult(new point_1.Point(2)));
        this.boxBackground = boxbackgrounds_1.BoxBackgroundFactory.Create(configuration.BackgroundType, configuration.Background, this.size.Clone());
        this.fontSize = configuration.FontSize;
        this.fontColor = configuration.FontColor;
    }
    get Text() {
        return this.textLines.join(" ");
    }
    set Text(text) {
        const _text = this.Text;
        if (text.indexOf(_text) === 0) {
            const slice = text.slice(_text.length);
            this.textLines[this.textLines.length - 1] += slice;
            if (slice.length > 1) {
                this.nextWord = REWRAP_THIS_LINE;
            }
        }
        else {
            this.textLines = [text];
        }
    }
    set NextWord(nextWord) {
        this.nextWord = nextWord;
    }
    Draw(canvas) {
        canvas.Translate(this.position);
        this.boxBackground.Draw(canvas);
        canvas.Translate(this.position.Add(this.innerMargin));
        if (this.nextWord != null) {
            this.doTheWrap(canvas);
            this.nextWord = null;
        }
        for (let i = 0; i < this.textLines.length; ++i) {
            canvas.DrawText(this.textLines[i], new point_1.Point(0, i * (this.fontSize * 1.42857)), // This is the golden ratio, on line-height and font-size
            this.fontColor, this.fontSize, this.innerSize.X);
        }
        canvas.Restore();
    }
    doTheWrap(canvas) {
        canvas.DrawText0("", "transparent", this.fontSize);
        const comp = (line) => canvas.MeasureTextWidth(line) > this.innerSize.X;
        let lastLine = this.textLines[this.textLines.length - 1];
        if (this.nextWord === REWRAP_THIS_LINE) {
            // Need to wrap the fuck out of this line
            while (comp(lastLine)) {
                // Get to the char where we're outside the boudaries
                let n = 0;
                while (!comp(lastLine.slice(0, n))) {
                    ++n;
                }
                // Get the previous space
                while (lastLine[n] !== " " && n >= 0) {
                    --n;
                }
                if (n === 0) {
                    break;
                } // We can't wrap more
                // Append, update last line, and back in the loop
                this.textLines.push(lastLine.slice(n + 1)); // +1 because we don't want the space
                this.textLines[this.textLines.length - 2] = lastLine.slice(0, n);
                lastLine = this.textLines[this.textLines.length - 1];
            }
        }
        else {
            if (comp(lastLine + this.nextWord)) {
                this.textLines[this.textLines.length - 1] = lastLine.slice(0, lastLine.length - 1);
                this.textLines.push("");
            }
        }
    }
}
class NameBox {
    constructor(position, configuration, name) {
        this.backgroundURL = "images/9patch-small.png";
        this.size = new point_1.Point(configuration.Width, configuration.Height);
        this.position = position.Clone();
        this.position.Y -= this.size.Y;
        this.innerMargin = this.size.Div(new point_1.Point(10, 10));
        this.fontSize = configuration.FontSize;
        this.fontColor = configuration.FontColor;
        this.boxBackground = boxbackgrounds_1.BoxBackgroundFactory.Create(configuration.BackgroundType, configuration.Background, this.size.Clone());
    }
    set Name(name) {
        if (name !== this.name) {
            this.name = name;
        }
    }
    Draw(canvas) {
        if (this.name.length > 0) {
            canvas.Translate(this.position);
            this.boxBackground.Draw(canvas);
            canvas.DrawText(this.name, this.innerMargin, this.fontColor, this.fontSize, this.size.X);
            canvas.Restore();
        }
    }
}
class SpeechLayer extends layers_1.GameplayLayer {
    constructor(screenSize, speechBoxConfiguration) {
        super();
        this.textAppeared = false;
        this.textTime = 0;
        const textBoxSize = new point_1.Point(screenSize.X - (speechBoxConfiguration.OuterMargin.X * 2), speechBoxConfiguration.Height);
        const textBoxPosition = new point_1.Point(speechBoxConfiguration.OuterMargin.X, screenSize.Y - speechBoxConfiguration.OuterMargin.Y - speechBoxConfiguration.Height);
        this.textBox = new SpeechBox(textBoxPosition, textBoxSize, speechBoxConfiguration);
        this.nameBox = new NameBox(textBoxPosition.Add(new point_1.Point(70, 0)), {
            Background: speechBoxConfiguration.Background,
            BackgroundType: speechBoxConfiguration.BackgroundType,
            FontColor: "white",
            FontSize: 24,
            Height: 40,
            Width: 100
        });
    }
    Draw(canvas) {
        this.textBox.Draw(canvas);
        this.nameBox.Draw(canvas);
    }
    MouseClick(clickPosition, action) {
        if (this.textAppeared) {
            action();
        }
        else {
            this.textBox.Text = this.fullText;
            this.textAppeared = true;
        }
    }
    MouseMove(mousePosition) {
        return null;
    }
    Say(text, name) {
        this.textBox.Text = "";
        this.fullText = text;
        this.textAppeared = false;
        this.nameBox.Name = name;
    }
    Step(delta) {
        this.textTime += delta;
        while (this.textTime >= config_1.Config.TextSpeedRatio) {
            if (this.textBox.Text.length < this.fullText.length) {
                const c = this.fullText.slice(this.textBox.Text.length, this.textBox.Text.length + 1);
                this.textBox.Text += c;
                if (c === " " && this.textBox.Text.length + 2 < this.fullText.length) {
                    let n = this.textBox.Text.length;
                    while (this.fullText[n] === " " && n < this.fullText.length) {
                        ++n;
                    }
                    if (n < this.fullText.length) {
                        while (this.fullText[n] !== " " && n < this.fullText.length) {
                            ++n;
                        }
                    }
                    this.textBox.NextWord = this.fullText.slice(this.textBox.Text.length + 1, n);
                }
            }
            else {
                this.textAppeared = true;
            }
            this.textTime = this.textTime - config_1.Config.TextSpeedRatio;
        }
    }
}
exports.SpeechLayer = SpeechLayer;
},{"../config":3,"../point":14,"./boxbackgrounds":6,"./layers":9}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../events");
const point_1 = require("../point");
const layers_1 = require("./layers");
class Transition extends layers_1.StepLayer {
    constructor(imageData) {
        super();
        this._onEnd = new events_1.LiteEvent();
        this.time = 0;
        this.totalTime = 2000.0;
        // sin equation: y = a*sin(b*x + c) + d
        // a sin period is 2PI / b
        // we want a half period of totalTime so we're looking for b: b = 2PI / period
        this.b = (Math.PI * 2) / (this.totalTime * 2);
        createImageBitmap(imageData).then(image => this.image = image);
    }
    get OnEnd() {
        return this._onEnd.Expose();
    }
    Draw(canvas) {
        if (this.image != null) {
            canvas.DrawBackgroundImage(this.image);
        }
        canvas.DrawRect(new point_1.Point(), canvas.Size, `rgba(0.0, 0.0, 0.0, ${Math.sin(this.b * this.time)})`);
    }
    Step(delta) {
        this.time += delta;
        if (this.image != null && this.time >= this.totalTime / 2) {
            this.image = null;
        }
        if (this.time >= this.totalTime) {
            this._onEnd.Trigger(this, null);
        }
    }
}
exports.Transition = Transition;
},{"../events":4,"../point":14,"./layers":9}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClassLoader {
    LoadImage(URL) {
        return new Promise((resolve, reject) => {
            const worker = this.createWorker();
            worker.addEventListener("message", (evt) => {
                if (evt.data.err) {
                    reject();
                }
                else {
                    resolve(evt.data);
                }
                worker.terminate();
            });
            worker.postMessage(`${window.location.href.replace(/[^\\\/]*$/, "")}${URL}`);
        });
    }
    createWorker() {
        return new Worker(URL.createObjectURL(new Blob([`(function ${this.worker})()`])));
    }
    worker() {
        const ctx = self;
        ctx.addEventListener("message", (evt) => {
            fetch(evt.data).then(response => response.blob()).then(blobData => {
                createImageBitmap(blobData).then(image => ctx.postMessage(image));
            });
        });
    }
}
exports.Loader = new ClassLoader();
},{}],13:[function(require,module,exports){
(function (global){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InkJs = (typeof window !== "undefined" ? window['inkjs'] : typeof global !== "undefined" ? global['inkjs'] : null);
const audio_1 = require("./audio");
const canvas_1 = require("./canvas");
const config_1 = require("./config");
const boxbackgrounds_1 = require("./layers/boxbackgrounds");
const Layers = require("./layers/layers");
const point_1 = require("./point");
const preloader_1 = require("./preloader");
class VN {
    constructor(storyFilename, containerID) {
        this.speakingCharacterName = "";
        this.Audio = audio_1.AudioFactory.Create();
        this.Canvas = new canvas_1.Canvas(containerID, config_1.Config.ScreenSize);
        fetch(storyFilename).then(response => response.text()).then(rawStory => {
            this.Story = new InkJs.story(rawStory);
            config_1.Config.Load(this.Story.globalTags || []);
            this.Canvas.Size = config_1.Config.ScreenSize;
            this.background = new Layers.Background();
            this.characters = new Layers.Characters();
            this.speechScreen = new Layers.SpeechLayer(this.Canvas.Size, {
                Background: "rgba(0.0, 0.0, 0.0, 0.75)",
                BackgroundType: boxbackgrounds_1.BoxBackgroundTypes.COLOR,
                FontColor: "white",
                FontSize: 24,
                Height: 200,
                InnerMargin: new point_1.Point(35),
                OuterMargin: new point_1.Point(50)
            });
            this.choiceScreen = new Layers.ChoiceLayer(this.Canvas.Size);
            this.Canvas.OnClick.On(this.mouseClick.bind(this));
            this.Canvas.OnMove.On(this.mouseMove.bind(this));
            this.continue();
            this.previousTimestamp = 0;
            this.requestStep();
        });
    }
    computeTags() {
        const getFinalValue = (value) => {
            const valueMatch = value.match(/^\{(\w+)\}$/);
            if (valueMatch != null) {
                return this.Story.variablesState.$(valueMatch[1]);
            }
            return value;
        };
        const tags = this.Story.currentTags;
        if (tags.length > 0) {
            for (let i = 0; i < tags.length; ++i) {
                const match = tags[i].match(/^(\w+)\s*:\s*(.*)$/);
                if (match != null) {
                    // We need to know what tag it is
                    const key = match[1];
                    const value = getFinalValue(match[2]);
                    switch (key) {
                        case "preload": {
                            value.split(",").forEach(_value => preloader_1.Preloader.Preload(_value.trim()));
                            break;
                        }
                        case "background": {
                            this.background.BackgroundImage = value;
                            break;
                        }
                        case "sprite": {
                            if (value.length > 0) {
                                this.characters.Add(value, this.Canvas);
                            }
                            else {
                                this.characters.Remove();
                            }
                            break;
                        }
                        case "name": {
                            this.speakingCharacterName = value;
                            break;
                        }
                        case "bgm": {
                            if (value.length > 0) {
                                this.Audio.PlayBGM(value);
                            }
                            else {
                                this.Audio.StopBGM();
                            }
                            break;
                        }
                        case "sfx": {
                            this.Audio.PlaySFX(value);
                            break;
                        }
                        case "transition": {
                            this.transition = new Layers.Transition(this.Canvas.GetImageData());
                            this.transition.OnEnd.On((sender, args) => {
                                this.transition = null;
                            });
                            break;
                        }
                    }
                }
                else {
                    // Unknown tags are treated as names
                    this.speakingCharacterName = getFinalValue(tags[i]);
                }
            }
        }
    }
    continue() {
        if (this.transition != null) {
            return;
        }
        if (this.Story.canContinue) {
            this.Story.Continue();
            if (this.Story.currentText.replace(/\s/g, "").length <= 0) {
                this.continue();
            }
            else {
                this.computeTags();
                this.speechScreen.Say(this.Story.currentText, this.speakingCharacterName);
                this.currentScreen = this.speechScreen;
            }
        }
        else if (this.Story.currentChoices.length > 0) {
            this.computeTags();
            this.choiceScreen.Choices = this.Story.currentChoices;
            this.currentScreen = this.choiceScreen;
        }
        else {
            // TODO It's the end
        }
    }
    mouseClick(sender, clickPosition) {
        if (this.transition != null) {
            return;
        }
        if (this.currentScreen instanceof Layers.ChoiceLayer) {
            this.currentScreen.MouseClick(clickPosition, this.validateChoice.bind(this));
        }
        else {
            this.currentScreen.MouseClick(clickPosition, () => this.continue());
        }
    }
    mouseMove(sender, mousePosition) {
        const callback = this.currentScreen.MouseMove(mousePosition);
        if (callback != null) {
            callback(sender);
        }
    }
    requestStep() {
        window.requestAnimationFrame(this.step.bind(this));
    }
    step(timestamp) {
        const delta = timestamp - this.previousTimestamp;
        this.previousTimestamp = timestamp;
        this.Canvas.Clear();
        if (this.transition != null) {
            this.transition.Step(delta);
        }
        else {
            this.currentScreen.Step(delta);
        }
        this.background.Draw(this.Canvas);
        this.characters.Draw(this.Canvas);
        if (this.transition != null) {
            this.transition.Draw(this.Canvas);
        }
        else {
            this.currentScreen.Draw(this.Canvas);
        }
        this.requestStep();
    }
    validateChoice(choiceIndex) {
        this.Story.ChooseChoiceIndex(choiceIndex);
        this.continue();
    }
}
exports.VN = VN;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./audio":1,"./canvas":2,"./config":3,"./layers/boxbackgrounds":6,"./layers/layers":9,"./point":14,"./preloader":15}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Point {
    constructor(x, y) {
        this.x = x != null ? x : 0;
        this.y = y != null ? y : x != null ? x : 0;
    }
    get X() {
        return this.x;
    }
    set X(x) {
        this.x = x;
    }
    get Y() {
        return this.y;
    }
    set Y(y) {
        this.y = y;
    }
    Add(point) {
        return new Point(this.X + point.X, this.Y + point.Y);
    }
    Clone() {
        return new Point(this.X, this.Y);
    }
    Div(point) {
        return new Point(this.X / point.X, this.Y / point.Y);
    }
    IsInRect(rect) {
        return this.X >= rect.Position.X && this.X <= rect.Position.Add(rect.Size).X
            && this.Y >= rect.Position.Y && this.Y <= rect.Position.Add(rect.Size).Y;
    }
    Mult(point) {
        return new Point(this.X * point.X, this.Y * point.Y);
    }
    Sub(point) {
        return this.Add(new Point(-point.X, -point.Y));
    }
}
exports.Point = Point;
},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClassPreloader {
    Preload(url) {
        fetch(url);
    }
}
exports.Preloader = new ClassPreloader();
},{}]},{},[13])(13)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXVkaW8udHMiLCJzcmMvY2FudmFzLnRzIiwic3JjL2NvbmZpZy50cyIsInNyYy9ldmVudHMudHMiLCJzcmMvbGF5ZXJzL2JhY2tncm91bmQudHMiLCJzcmMvbGF5ZXJzL2JveGJhY2tncm91bmRzLnRzIiwic3JjL2xheWVycy9jaGFyYWN0ZXJzLnRzIiwic3JjL2xheWVycy9jaG9pY2VsYXllci50cyIsInNyYy9sYXllcnMvbGF5ZXJzLnRzIiwic3JjL2xheWVycy9zcGVlY2hsYXllci50cyIsInNyYy9sYXllcnMvdHJhbnNpdGlvbi50cyIsInNyYy9sb2FkZXIudHMiLCJzcmMvbWFpbi50cyIsInNyYy9wb2ludC50cyIsInNyYy9wcmVsb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSx1Q0FBdUM7QUFFdkMsTUFBYSxZQUFZO0lBQ3JCLE1BQU0sQ0FBQyxNQUFNO1FBQ1QsSUFBSSxTQUFTLElBQUksSUFBSSxFQUFFO1lBQ25CLE9BQU8sSUFBSSxjQUFjLEVBQUUsQ0FBQztTQUMvQjthQUFNO1lBQ0gsT0FBTyxJQUFJLFVBQVUsRUFBRSxDQUFDO1NBQzNCO0lBQ0wsQ0FBQztDQUNKO0FBUkQsb0NBUUM7QUFFRCxNQUFzQixLQUFLO0NBSTFCO0FBSkQsc0JBSUM7QUFFRCxNQUFNLGNBQWUsU0FBUSxLQUFLO0lBSTlCLE9BQU8sQ0FBQyxNQUFlO1FBQ25CLElBQUksTUFBTSxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFFckIsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDO2dCQUM1QixPQUFPLEVBQUc7b0JBQ04sSUFBSSxFQUFHLElBQUk7b0JBQ1gsSUFBSSxFQUFHLE1BQU07aUJBQ2hCO2dCQUNELE1BQU0sRUFBRyxNQUFNO2FBQ2xCLEVBQUUsR0FB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LEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFZO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2VBQ3JFLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pGLENBQUM7SUFFRCxJQUFJLENBQUMsS0FBYTtRQUNkLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxHQUFHLENBQUMsS0FBYTtRQUNiLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRCxDQUFDO0NBQ0o7QUFwREQsc0JBb0RDOzs7O0FDekRELE1BQU0sY0FBYztJQUNoQixPQUFPLENBQUMsR0FBWTtRQUNoQixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZixDQUFDO0NBQ0o7QUFFWSxRQUFBLFNBQVMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0ICogYXMgUGl6emljYXRvIGZyb20gXCJwaXp6aWNhdG9cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBdWRpb0ZhY3Rvcnkge1xyXG4gICAgc3RhdGljIENyZWF0ZSgpIDogQXVkaW8ge1xyXG4gICAgICAgIGlmIChQaXp6aWNhdG8gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFBpenppY2F0b0F1ZGlvKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEdW1teUF1ZGlvKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQXVkaW8ge1xyXG4gICAgYWJzdHJhY3QgUGxheUJHTShiZ21VUkwgOiBzdHJpbmcpIDogdm9pZDtcclxuICAgIGFic3RyYWN0IFBsYXlTRlgoc2Z4VVJMIDogc3RyaW5nKSA6IHZvaWQ7XHJcbiAgICBhYnN0cmFjdCBTdG9wQkdNKCkgOiB2b2lkO1xyXG59XHJcblxyXG5jbGFzcyBQaXp6aWNhdG9BdWRpbyBleHRlbmRzIEF1ZGlvIHtcclxuICAgIHByaXZhdGUgYmdtIDogUGl6emljYXRvLlNvdW5kO1xyXG4gICAgcHJpdmF0ZSBiZ21VUkwgOiBzdHJpbmc7XHJcblxyXG4gICAgUGxheUJHTShiZ21VUkwgOiBzdHJpbmcpIDogdm9pZCB7XHJcbiAgICAgICAgaWYgKGJnbVVSTCAhPT0gdGhpcy5iZ21VUkwpIHtcclxuICAgICAgICAgICAgdGhpcy5iZ21VUkwgPSBiZ21VUkw7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBiZ20gPSBuZXcgUGl6emljYXRvLlNvdW5kKHtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMgOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9vcCA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aCA6IGJnbVVSTFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNvdXJjZSA6IFwiZmlsZVwiXHJcbiAgICAgICAgICAgIH0sICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJnbSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iZ20uc3RvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmdtLmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJnbS5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJnbSA9IGJnbTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFBsYXlTRlgoc2Z4VVJMIDogc3RyaW5nKSA6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHNmeCA9IG5ldyBQaXp6aWNhdG8uU291bmQoe1xyXG4gICAgICAgICAgICBvcHRpb25zIDogeyBwYXRoIDogc2Z4VVJMIH0sXHJcbiAgICAgICAgICAgIHNvdXJjZSA6IFwiZmlsZVwiXHJcbiAgICAgICAgfSwgKCkgPT4gc2Z4LnBsYXkoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgU3RvcEJHTSgpIDogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuYmdtICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5iZ20uc3RvcCgpO1xyXG4gICAgICAgICAgICB0aGlzLmJnbS5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuYmdtVVJMID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5iZ20gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgRHVtbXlBdWRpbyBleHRlbmRzIEF1ZGlvIHtcclxuICAgIFBsYXlCR00oYmdtVVJMIDogc3RyaW5nKSA6IHZvaWQgeyB9XHJcbiAgICBQbGF5U0ZYKHNmeFVSTCA6IHN0cmluZykgOiB2b2lkIHsgfVxyXG4gICAgU3RvcEJHTSgpIDogdm9pZCB7IH1cclxufVxyXG4iLCJpbXBvcnQgeyBMaXRlRXZlbnQgfSBmcm9tIFwiLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgSVJlY3QsIFBvaW50IH0gZnJvbSBcIi4vcG9pbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDYW52YXMge1xyXG4gICAgcHJpdmF0ZSBfb25DbGljayA6IExpdGVFdmVudDxDYW52YXMsIFBvaW50PiA9IG5ldyBMaXRlRXZlbnQ8Q2FudmFzLCBQb2ludD4oKTtcclxuICAgIHByaXZhdGUgX29uTW92ZSA6IExpdGVFdmVudDxDYW52YXMsIFBvaW50PiA9IG5ldyBMaXRlRXZlbnQ8Q2FudmFzLCBQb2ludD4oKTtcclxuICAgIHByaXZhdGUgY3R4IDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgcHJpdmF0ZSBlbGVtZW50IDogSFRNTENhbnZhc0VsZW1lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVySUQgOiBzdHJpbmcsIHNpemUgOiBQb2ludCkge1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbnRhaW5lcklEKTtcclxuXHJcbiAgICAgICAgaWYgKGNvbnRhaW5lci50YWdOYW1lID09PSBcImNhbnZhc1wiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9IGNvbnRhaW5lciBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC53aWR0aCA9IHNpemUuWDtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuaGVpZ2h0ID0gc2l6ZS5ZO1xyXG5cclxuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuZWxlbWVudC5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICAgICAgaWYgKCF0aGlzLmN0eCkge1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLl9jbGljay5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLl9tb3ZlLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICB0aGlzLkNsZWFyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IFNpemUoKSA6IFBvaW50IHtcclxuICAgICAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMuZWxlbWVudC53aWR0aCwgdGhpcy5lbGVtZW50LmhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IFNpemUoc2l6ZSA6IFBvaW50KSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LndpZHRoID0gc2l6ZS5YO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5oZWlnaHQgPSBzaXplLlk7XHJcbiAgICB9XHJcblxyXG4gICAgQ2xlYXIoKSA6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmVsZW1lbnQud2lkdGgsIHRoaXMuZWxlbWVudC5oZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIERyYXdCYWNrZ3JvdW5kSW1hZ2UoaW1hZ2UgOiBJbWFnZUJpdG1hcCkgOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoaW1hZ2UsIDAsIDAsIHRoaXMuZWxlbWVudC53aWR0aCwgdGhpcy5lbGVtZW50LmhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgRHJhd0ltYWdlKGltYWdlIDogSW1hZ2VCaXRtYXAsIHBvc2l0aW9uIDogUG9pbnQpIDogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKGltYWdlLCBwb3NpdGlvbi5YLCBwb3NpdGlvbi5ZLCBpbWFnZS53aWR0aCwgaW1hZ2UuaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICBEcmF3SW1hZ2VUbyhpbWFnZSA6IEltYWdlQml0bWFwLCBzb3VyY2UgOiBJUmVjdCwgZGVzdGluYXRpb24gOiBJUmVjdCkge1xyXG4gICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShcclxuICAgICAgICAgICAgaW1hZ2UsXHJcbiAgICAgICAgICAgIHNvdXJjZS5Qb3NpdGlvbi5YLCBzb3VyY2UuUG9zaXRpb24uWSxcclxuICAgICAgICAgICAgc291cmNlLlNpemUuWCwgc291cmNlLlNpemUuWSxcclxuICAgICAgICAgICAgZGVzdGluYXRpb24uUG9zaXRpb24uWCwgZGVzdGluYXRpb24uUG9zaXRpb24uWSxcclxuICAgICAgICAgICAgZGVzdGluYXRpb24uU2l6ZS5YLCBkZXN0aW5hdGlvbi5TaXplLllcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIERyYXdSZWN0KHBvc2l0aW9uIDogUG9pbnQsIHNpemUgOiBQb2ludCwgY29sb3IgOiBzdHJpbmcpIDogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QocG9zaXRpb24uWCwgcG9zaXRpb24uWSwgc2l6ZS5YLCBzaXplLlkpO1xyXG4gICAgfVxyXG5cclxuICAgIERyYXdSZWN0MChzaXplIDogUG9pbnQsIGNvbG9yIDogc3RyaW5nKSA6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuRHJhd1JlY3QobmV3IFBvaW50KCksIHNpemUsIGNvbG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBEcmF3VGV4dCh0ZXh0IDogc3RyaW5nLCBwb3NpdGlvbiA6IFBvaW50LCBjb2xvciA6IHN0cmluZywgZm9udFNpemUgOiBudW1iZXIsIG1heFdpZHRoPyA6IG51bWJlcikgOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2xvcjtcclxuICAgICAgICB0aGlzLmN0eC5mb250ID0gYCR7Zm9udFNpemV9cHggc2Fucy1zZXJpZmA7XHJcbiAgICAgICAgdGhpcy5jdHgudGV4dEJhc2VsaW5lID0gXCJ0b3BcIjtcclxuICAgICAgICB0aGlzLmN0eC5maWxsVGV4dCh0ZXh0LCBwb3NpdGlvbi5YLCBwb3NpdGlvbi5ZLCBtYXhXaWR0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgRHJhd1RleHQwKHRleHQgOiBzdHJpbmcsIGNvbG9yIDogc3RyaW5nLCBmb250U2l6ZSA6IG51bWJlciwgbWF4V2lkdGg/IDogbnVtYmVyKSA6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuRHJhd1RleHQodGV4dCwgbmV3IFBvaW50KCksIGNvbG9yLCBmb250U2l6ZSwgbWF4V2lkdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIEdldEltYWdlRGF0YSgpIDogSW1hZ2VEYXRhIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIHRoaXMuU2l6ZS5YLCB0aGlzLlNpemUuWSk7XHJcbiAgICB9XHJcblxyXG4gICAgTWVhc3VyZVRleHRXaWR0aCh0ZXh0IDogc3RyaW5nKSA6IG51bWJlciB7XHJcbiAgICAgICAgLy8gV2UgbWVhc3VyZSB3aXRoIHRoZSBsYXN0IGZvbnQgdXNlZCBpbiB0aGUgY29udGV4dFxyXG4gICAgICAgIHJldHVybiB0aGlzLmN0eC5tZWFzdXJlVGV4dCh0ZXh0KS53aWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBSZXN0b3JlKCkgOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgU2V0Q3Vyc29yKGN1cnNvciA6IHN0cmluZykgOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuY3Vyc29yID0gY3Vyc29yO1xyXG4gICAgfVxyXG5cclxuICAgIFRyYW5zbGF0ZShwb3NpdGlvbiA6IFBvaW50KSA6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuUmVzdG9yZSgpO1xyXG4gICAgICAgIHRoaXMuY3R4LnNhdmUoKTtcclxuICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUocG9zaXRpb24uWCwgcG9zaXRpb24uWSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IE9uQ2xpY2soKSA6IExpdGVFdmVudDxDYW52YXMsIFBvaW50PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uQ2xpY2suRXhwb3NlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IE9uTW92ZSgpIDogTGl0ZUV2ZW50PENhbnZhcywgUG9pbnQ+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb25Nb3ZlLkV4cG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NsaWNrKGV2IDogTW91c2VFdmVudCkgOiB2b2lkIHtcclxuICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMuX29uQ2xpY2suVHJpZ2dlcih0aGlzLCBuZXcgUG9pbnQoXHJcbiAgICAgICAgICAgIGV2LnBhZ2VYIC0gdGhpcy5lbGVtZW50Lm9mZnNldExlZnQsXHJcbiAgICAgICAgICAgIGV2LnBhZ2VZIC0gdGhpcy5lbGVtZW50Lm9mZnNldFRvcFxyXG4gICAgICAgICkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX21vdmUoZXYgOiBNb3VzZUV2ZW50KSA6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX29uTW92ZS5UcmlnZ2VyKHRoaXMsIG5ldyBQb2ludChcclxuICAgICAgICAgICAgZXYucGFnZVggLSB0aGlzLmVsZW1lbnQub2Zmc2V0TGVmdCxcclxuICAgICAgICAgICAgZXYucGFnZVkgLSB0aGlzLmVsZW1lbnQub2Zmc2V0VG9wXHJcbiAgICAgICAgKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBIaWRkZW5DYW52YXMgZXh0ZW5kcyBDYW52YXMge1xyXG4gICAgcHJpdmF0ZSBoaWRkZW5FbGVtZW50IDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2l6ZSA6IFBvaW50KSB7XHJcbiAgICAgICAgY29uc3QgaWQgPSBgY18ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoKS5zbGljZSgyLCA3KX1gO1xyXG4gICAgICAgIGNvbnN0IGhpZGRlbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGhpZGRlbkVsZW1lbnQuaWQgPSBpZDtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGhpZGRlbkVsZW1lbnQpO1xyXG5cclxuICAgICAgICBzdXBlcihpZCwgc2l6ZSk7XHJcblxyXG4gICAgICAgIHRoaXMuaGlkZGVuRWxlbWVudCA9IGhpZGRlbkVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgRGVzdHJveSgpIDogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5oaWRkZW5FbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4vcG9pbnRcIjtcclxuXHJcbmNsYXNzIENsYXNzQ29uZmlnIHtcclxuICAgIERlZmF1bHRUZXh0U3BlZWQgOiBudW1iZXIgPSAzMDtcclxuICAgIFNjcmVlblNpemUgOiBQb2ludCA9IG5ldyBQb2ludCg4MDAsIDYwMCk7XHJcblxyXG4gICAgcHJpdmF0ZSB0ZXh0U3BlZWQgOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIHRleHRTcGVlZFJhdGlvIDogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuVGV4dFNwZWVkID0gdGhpcy5EZWZhdWx0VGV4dFNwZWVkOyAvLyBUaGlzIGlzIGluIGNoYXIgcGVyIHNlY29uZFxyXG4gICAgfVxyXG5cclxuICAgIExvYWQodGFncyA6IHN0cmluZ1tdKSA6IHZvaWQge1xyXG4gICAgICAgIGZ1bmN0aW9uIGVycm9yKHRhZyA6IHN0cmluZykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciByZWFkaW5nIHRhZzogXCIke3RhZ31cImApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWdzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGxldCBrZXksIHZhbHVlO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAga2V5ID0gdGFnc1tpXS5zcGxpdChcIjpcIilbMF0udHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0YWdzW2ldLnNwbGl0KFwiOlwiKVsxXS50cmltKCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IodGFnc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzY3JlZW5fc2l6ZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzY3JlZW5zaXplXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2l6ZSA9IHZhbHVlLnNwbGl0KC9cXEQrLykubWFwKHggPT4gcGFyc2VJbnQoeCwgMTApKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNpemUubGVuZ3RoID09PSAyICYmICFpc05hTihzaXplWzBdKSAmJiAhaXNOYU4oc2l6ZVsxXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU2NyZWVuU2l6ZSA9IG5ldyBQb2ludChzaXplWzBdLCBzaXplWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInRleHRfc3BlZWRcIjpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwidGV4dHNwZWVkXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3BlZWQgPSBwYXJzZUludCh2YWx1ZSwgMTApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKHNwZWVkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5EZWZhdWx0VGV4dFNwZWVkID0gdGhpcy5UZXh0U3BlZWQgPSBzcGVlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IodGFnc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IFRleHRTcGVlZCgpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50ZXh0U3BlZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IFRleHRTcGVlZCh2YWx1ZSA6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMudGV4dFNwZWVkID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy50ZXh0U3BlZWRSYXRpbyA9IDEwMDAuMCAvIHRoaXMudGV4dFNwZWVkO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBUZXh0U3BlZWRSYXRpbygpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50ZXh0U3BlZWRSYXRpbztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGxldCBDb25maWcgPSBuZXcgQ2xhc3NDb25maWcoKTtcclxuIiwiZXhwb3J0IGNsYXNzIExpdGVFdmVudDxUMSwgVDI+IHtcclxuICAgIHByaXZhdGUgaGFuZGxlcnMgOiBBcnJheTwoc2VuZGVyIDogVDEsIGFyZz8gOiBUMikgPT4gdm9pZD4gPSBbXTtcclxuXHJcbiAgICBFeHBvc2UoKSA6IExpdGVFdmVudDxUMSwgVDI+IHtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBPZmYoaGFuZGxlciA6IChzZW5kZXIgOiBUMSwgYXJnPyA6IFQyKSA9PiB2b2lkKSA6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMgPSB0aGlzLmhhbmRsZXJzLmZpbHRlcihfaGFuZGxlciA9PiBfaGFuZGxlciAhPT0gaGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgT24oaGFuZGxlciA6IChzZW5kZXIgOiBUMSwgYXJnPyA6IFQyKSA9PiB2b2lkKSA6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMucHVzaChoYW5kbGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBUcmlnZ2VyKHNlbmRlciA6IFQxLCBhcmdzPyA6IFQyKSA6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuZm9yRWFjaChoYW5kbGVyID0+IGhhbmRsZXIoc2VuZGVyLCBhcmdzKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ2FudmFzIH0gZnJvbSBcIi4uL2NhbnZhc1wiO1xyXG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tIFwiLi4vbG9hZGVyXCI7XHJcbmltcG9ydCB7IExheWVyIH0gZnJvbSBcIi4vbGF5ZXJzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQmFja2dyb3VuZCBleHRlbmRzIExheWVyIHtcclxuICAgIHByaXZhdGUgYmFja2dyb3VuZEltYWdlIDogSW1hZ2VCaXRtYXA7XHJcbiAgICBwcml2YXRlIGJhY2tncm91bmRJbWFnZVVSTCA6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpO1xyXG4gICAgY29uc3RydWN0b3IoaW1hZ2VVUkw/IDogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgaWYgKGltYWdlVVJMICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5CYWNrZ3JvdW5kSW1hZ2UgPSBpbWFnZVVSTDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IEJhY2tncm91bmRJbWFnZShpbWFnZVVSTCA6IHN0cmluZykge1xyXG4gICAgICAgIGlmIChpbWFnZVVSTCAhPT0gdGhpcy5iYWNrZ3JvdW5kSW1hZ2VVUkwpIHtcclxuICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kSW1hZ2VVUkwgPSBpbWFnZVVSTDtcclxuICAgICAgICAgICAgTG9hZGVyLkxvYWRJbWFnZShpbWFnZVVSTCkudGhlbihpbWFnZSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJhY2tncm91bmRJbWFnZSA9IGltYWdlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuYmFja2dyb3VuZEltYWdlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgY2FudmFzLkRyYXdCYWNrZ3JvdW5kSW1hZ2UodGhpcy5iYWNrZ3JvdW5kSW1hZ2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDYW52YXMsIEhpZGRlbkNhbnZhcyB9IGZyb20gXCIuLi9jYW52YXNcIjtcclxuaW1wb3J0IHsgTG9hZGVyIH0gZnJvbSBcIi4uL2xvYWRlclwiO1xyXG5pbXBvcnQgeyBJUmVjdCwgUG9pbnQgfSBmcm9tIFwiLi4vcG9pbnRcIjtcclxuaW1wb3J0IHsgTGF5ZXIgfSBmcm9tIFwiLi9sYXllcnNcIjtcclxuXHJcbmV4cG9ydCBlbnVtIEJveEJhY2tncm91bmRUeXBlcyB7XHJcbiAgICBDT0xPUiwgTklORVBBVENILCBTVFJFVENIXHJcbn1cclxuXHJcbmNsYXNzIENsYXNzQm94QmFja2dyb3VuZEZhY3Rvcnkge1xyXG4gICAgQ3JlYXRlKHR5cGUgOiBCb3hCYWNrZ3JvdW5kVHlwZXMsIGJhY2tncm91bmQgOiBzdHJpbmcsIHNpemUgOiBQb2ludCwgcG9zaXRpb24/IDogUG9pbnQpIDogQm94QmFja2dyb3VuZCB7XHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgQm94QmFja2dyb3VuZFR5cGVzLkNPTE9SOiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvbG9yZWRCb3hCYWNrZ3JvdW5kKGJhY2tncm91bmQsIHNpemUsIHBvc2l0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIEJveEJhY2tncm91bmRUeXBlcy5OSU5FUEFUQ0g6IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTmluZVBhdGNoQm94QmFja2dyb3VuZChiYWNrZ3JvdW5kLCBzaXplLCBwb3NpdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBCb3hCYWNrZ3JvdW5kVHlwZXMuU1RSRVRDSDoge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdHJldGNoQm94QmFja2dyb3VuZChiYWNrZ3JvdW5kLCBzaXplLCBwb3NpdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBCb3hCYWNrZ3JvdW5kRmFjdG9yeSA6IENsYXNzQm94QmFja2dyb3VuZEZhY3RvcnkgPSBuZXcgQ2xhc3NCb3hCYWNrZ3JvdW5kRmFjdG9yeSgpO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJveEJhY2tncm91bmQgZXh0ZW5kcyBMYXllciB7XHJcbiAgICBwcm90ZWN0ZWQgYm94IDogSVJlY3Q7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2l6ZSA6IFBvaW50LCBwb3NpdGlvbj8gOiBQb2ludCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuYm94ID0ge1xyXG4gICAgICAgICAgICBQb3NpdGlvbiA6IHBvc2l0aW9uID09IG51bGwgPyBuZXcgUG9pbnQoKSA6IHBvc2l0aW9uLFxyXG4gICAgICAgICAgICBTaXplIDogc2l6ZVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IFBvc2l0aW9uKHBvc2l0aW9uIDogUG9pbnQpIHtcclxuICAgICAgICB0aGlzLmJveC5Qb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBTaXplKHNpemUgOiBQb2ludCkge1xyXG4gICAgICAgIHRoaXMuYm94LlNpemUgPSBzaXplO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBDb2xvcmVkQm94QmFja2dyb3VuZCBleHRlbmRzIEJveEJhY2tncm91bmQge1xyXG4gICAgQ29sb3IgOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29sb3IgOiBzdHJpbmcsIHNpemUgOiBQb2ludCwgcG9zaXRpb24/IDogUG9pbnQpIHtcclxuICAgICAgICBzdXBlcihzaXplLCBwb3NpdGlvbik7XHJcblxyXG4gICAgICAgIHRoaXMuQ29sb3IgPSBjb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcclxuICAgICAgICBjYW52YXMuRHJhd1JlY3QodGhpcy5ib3guUG9zaXRpb24sIHRoaXMuYm94LlNpemUsIHRoaXMuQ29sb3IpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBOaW5lUGF0Y2hCb3hCYWNrZ3JvdW5kIGV4dGVuZHMgQm94QmFja2dyb3VuZCB7XHJcbiAgICBwcml2YXRlIG5pbmVQYXRjaCA6IEltYWdlQml0bWFwO1xyXG4gICAgcHJpdmF0ZSBuaW5lUGF0Y2hVUkwgOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IobmluZVBhdGNoVVJMIDogc3RyaW5nLCBzaXplIDogUG9pbnQsIHBvc2l0aW9uPyA6IFBvaW50KSB7XHJcbiAgICAgICAgc3VwZXIoc2l6ZSwgcG9zaXRpb24pO1xyXG5cclxuICAgICAgICB0aGlzLk5pbmVQYXRjaCA9IG5pbmVQYXRjaFVSTDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgTmluZVBhdGNoKG5pbmVQYXRjaFVSTCA6IHN0cmluZykge1xyXG4gICAgICAgIGlmIChuaW5lUGF0Y2hVUkwgIT09IHRoaXMubmluZVBhdGNoVVJMKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmluZVBhdGNoVVJMID0gbmluZVBhdGNoVVJMO1xyXG5cclxuICAgICAgICAgICAgTG9hZGVyLkxvYWRJbWFnZShuaW5lUGF0Y2hVUkwpXHJcbiAgICAgICAgICAgIC50aGVuKGltYWdlID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhpZGRlbkNhbnZhcyA9IG5ldyBIaWRkZW5DYW52YXModGhpcy5ib3guU2l6ZS5DbG9uZSgpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGNoU2l6ZSA9IG5ldyBQb2ludChpbWFnZS53aWR0aCAvIDMsIGltYWdlLmhlaWdodCAvIDMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGRyYXdQYXRjaFRvKHBhdGNoUG9zaXRpb24gOiBQb2ludCwgZGVzdFBvcyA6IFBvaW50LCBkZXN0U2l6ZT8gOiBQb2ludCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhpZGRlbkNhbnZhcy5EcmF3SW1hZ2VUbyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2UsIHsgUG9zaXRpb24gOiBwYXRjaFBvc2l0aW9uLCBTaXplIDogcGF0Y2hTaXplIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgUG9zaXRpb24gOiBkZXN0UG9zLCBTaXplIDogZGVzdFNpemUgIT0gbnVsbCA/IGRlc3RTaXplIDogcGF0Y2hTaXplIH1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGNoRGVzdGluYXRpb25zID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludCgpLCBuZXcgUG9pbnQodGhpcy5ib3guU2l6ZS5YIC0gcGF0Y2hTaXplLlgsIDApLFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludCgwLCB0aGlzLmJveC5TaXplLlkgLSBwYXRjaFNpemUuWSksXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KHRoaXMuYm94LlNpemUuWCAtIHBhdGNoU2l6ZS5YLCB0aGlzLmJveC5TaXplLlkgLSBwYXRjaFNpemUuWSlcclxuICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhuZXcgUG9pbnQoKSwgcGF0Y2hEZXN0aW5hdGlvbnNbMF0pOyAvLyBVcHBlciBMZWZ0XHJcbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMiwgMCkpLCBwYXRjaERlc3RpbmF0aW9uc1sxXSk7IC8vIFVwcGVyIFJpZ2h0XHJcbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMCwgMikpLCBwYXRjaERlc3RpbmF0aW9uc1syXSk7IC8vIExvd2VyIExlZnRcclxuICAgICAgICAgICAgICAgIGRyYXdQYXRjaFRvKHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgyLCAyKSksIHBhdGNoRGVzdGluYXRpb25zWzNdKTsgLy8gTG93ZXIgUmlnaHRcclxuXHJcbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMSwgMCkpLCBwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMSwgMCkpLFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludCh0aGlzLmJveC5TaXplLlggLSAocGF0Y2hTaXplLlggKiAyKSwgcGF0Y2hTaXplLlkpKTsgLy8gVG9wXHJcbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMiwgMSkpLCBwYXRjaERlc3RpbmF0aW9uc1sxXS5BZGQobmV3IFBvaW50KDAsIHBhdGNoU2l6ZS5ZKSksXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KHBhdGNoU2l6ZS5YLCB0aGlzLmJveC5TaXplLlkgLSAocGF0Y2hTaXplLlkgKiAyKSkpOyAvLyBSaWdodFxyXG4gICAgICAgICAgICAgICAgZHJhd1BhdGNoVG8ocGF0Y2hTaXplLk11bHQobmV3IFBvaW50KDEsIDIpKSwgcGF0Y2hEZXN0aW5hdGlvbnNbMl0uQWRkKG5ldyBQb2ludChwYXRjaFNpemUuWCwgMCkpLFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludCh0aGlzLmJveC5TaXplLlggLSAocGF0Y2hTaXplLlggKiAyKSwgcGF0Y2hTaXplLlkpKTsgLy8gQm90dG9tXHJcbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMCwgMSkpLCBwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMCwgMSkpLFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludChwYXRjaFNpemUuWCwgdGhpcy5ib3guU2l6ZS5ZIC0gKHBhdGNoU2l6ZS5ZICogMikpKTsgLy8gTGVmdFxyXG5cclxuICAgICAgICAgICAgICAgIGRyYXdQYXRjaFRvKHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgxLCAxKSksXHJcbiAgICAgICAgICAgICAgICAgICAgcGF0Y2hTaXplLk11bHQobmV3IFBvaW50KDEsIDEpKSwgdGhpcy5ib3guU2l6ZS5TdWIocGF0Y2hTaXplLk11bHQobmV3IFBvaW50KDIsIDIpKSkpOyAvLyBDZW50ZXJcclxuXHJcbiAgICAgICAgICAgICAgICBjcmVhdGVJbWFnZUJpdG1hcChoaWRkZW5DYW52YXMuR2V0SW1hZ2VEYXRhKCkpLnRoZW4obmluZVBhdGNoSW1hZ2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmluZVBhdGNoID0gbmluZVBhdGNoSW1hZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaGlkZGVuQ2FudmFzLkRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMubmluZVBhdGNoICE9IG51bGwpIHtcclxuICAgICAgICAgICAgY2FudmFzLkRyYXdJbWFnZSh0aGlzLm5pbmVQYXRjaCwgdGhpcy5ib3guUG9zaXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgU3RyZXRjaEJveEJhY2tncm91bmQgZXh0ZW5kcyBCb3hCYWNrZ3JvdW5kIHtcclxuICAgIHByaXZhdGUgaW1hZ2UgOiBJbWFnZUJpdG1hcDtcclxuICAgIHByaXZhdGUgaW1hZ2VTaXplIDogUG9pbnQ7XHJcbiAgICBwcml2YXRlIGltYWdlVVJMIDogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGltYWdlVVJMIDogc3RyaW5nLCBzaXplIDogUG9pbnQsIHBvc2l0aW9uIDogUG9pbnQpIHtcclxuICAgICAgICBzdXBlcihzaXplLCBwb3NpdGlvbik7XHJcblxyXG4gICAgICAgIHRoaXMuSW1hZ2UgPSBpbWFnZVVSTDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgSW1hZ2UoaW1hZ2VVUkwgOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoaW1hZ2VVUkwgIT09IHRoaXMuaW1hZ2VVUkwpIHtcclxuICAgICAgICAgICAgdGhpcy5pbWFnZVVSTCA9IGltYWdlVVJMO1xyXG5cclxuICAgICAgICAgICAgTG9hZGVyLkxvYWRJbWFnZShpbWFnZVVSTClcclxuICAgICAgICAgICAgLnRoZW4oaW1hZ2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZSA9IGltYWdlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZVNpemUgPSBuZXcgUG9pbnQodGhpcy5pbWFnZS53aWR0aCwgdGhpcy5pbWFnZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjYW52YXMuRHJhd0ltYWdlVG8oXHJcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlLFxyXG4gICAgICAgICAgICAgICAgeyBQb3NpdGlvbiA6IG5ldyBQb2ludCgpLCBTaXplIDogdGhpcy5pbWFnZVNpemUgfSxcclxuICAgICAgICAgICAgICAgIHsgUG9zaXRpb24gOiB0aGlzLmJveC5Qb3NpdGlvbiwgU2l6ZSA6IHRoaXMuYm94LlNpemUgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDYW52YXMgfSBmcm9tIFwiLi4vY2FudmFzXCI7XHJcbmltcG9ydCB7IExvYWRlciB9IGZyb20gXCIuLi9sb2FkZXJcIjtcclxuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vcG9pbnRcIjtcclxuaW1wb3J0IHsgTGF5ZXIgfSBmcm9tIFwiLi9sYXllcnNcIjtcclxuXHJcbmNsYXNzIENoYXJhY3RlciBleHRlbmRzIExheWVyIHtcclxuICAgIHByaXZhdGUgY2VudGVyUG9zWCA6IG51bWJlcjtcclxuICAgIHByaXZhdGUgcG9zaXRpb24gOiBQb2ludDtcclxuICAgIHByaXZhdGUgc3ByaXRlIDogSW1hZ2VCaXRtYXA7XHJcbiAgICBwcml2YXRlIHNwcml0ZVVSTCA6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzcHJpdGVVUkwgOiBzdHJpbmcsIHBvc1ggOiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLmNlbnRlclBvc1ggPSBwb3NYO1xyXG4gICAgICAgIHRoaXMuU3ByaXRlID0gc3ByaXRlVVJMO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBTcHJpdGUoc3ByaXRlVVJMIDogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHNwcml0ZVVSTCAhPT0gdGhpcy5zcHJpdGVVUkwpIHtcclxuICAgICAgICAgICAgdGhpcy5zcHJpdGVVUkwgPSBzcHJpdGVVUkw7XHJcbiAgICAgICAgICAgIExvYWRlci5Mb2FkSW1hZ2Uoc3ByaXRlVVJMKS50aGVuKGltYWdlID0+IHRoaXMuc3ByaXRlID0gaW1hZ2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5zcHJpdGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wb3NpdGlvbiA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFBvaW50KFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2VudGVyUG9zWCAtICh0aGlzLnNwcml0ZS53aWR0aCAvIDIpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbnZhcy5TaXplLlkgLSB0aGlzLnNwcml0ZS5oZWlnaHRcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNhbnZhcy5EcmF3SW1hZ2UodGhpcy5zcHJpdGUsIHRoaXMucG9zaXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJhY3RlcnMgZXh0ZW5kcyBMYXllciB7XHJcbiAgICBwcml2YXRlIGNoYXJhY3RlcnMgOiBDaGFyYWN0ZXJbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgQWRkKHNwcml0ZVVSTCA6IHN0cmluZywgY2FudmFzIDogQ2FudmFzKSB7XHJcbiAgICAgICAgLy8gRm9yIG5vdyBqdXN0IGhhbmRsZSBvbmUgY2hhcmFjdGVyIGF0IGEgdGltZVxyXG4gICAgICAgIGlmICh0aGlzLmNoYXJhY3RlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYXJhY3RlcnMgPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2hhcmFjdGVycy5wdXNoKG5ldyBDaGFyYWN0ZXIoc3ByaXRlVVJMLCBjYW52YXMuU2l6ZS5YIC8gMikpO1xyXG4gICAgfVxyXG5cclxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hhcmFjdGVyIG9mIHRoaXMuY2hhcmFjdGVycykge1xyXG4gICAgICAgICAgICBjaGFyYWN0ZXIuRHJhdyhjYW52YXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBSZW1vdmUoKSB7XHJcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXJzID0gW107XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ2hvaWNlIH0gZnJvbSBcImlua2pzXCI7XHJcbmltcG9ydCB7IENhbnZhcyB9IGZyb20gXCIuLi9jYW52YXNcIjtcclxuaW1wb3J0IHsgSVJlY3QsIFBvaW50IH0gZnJvbSBcIi4uL3BvaW50XCI7XHJcbmltcG9ydCB7IEJveEJhY2tncm91bmQsIEJveEJhY2tncm91bmRGYWN0b3J5LCBCb3hCYWNrZ3JvdW5kVHlwZXMgfSBmcm9tIFwiLi9ib3hiYWNrZ3JvdW5kc1wiO1xyXG5pbXBvcnQgeyBHYW1lcGxheUxheWVyIH0gZnJvbSBcIi4vbGF5ZXJzXCI7XHJcblxyXG5jbGFzcyBDaG9pY2VCb3gge1xyXG4gICAgcHJpdmF0ZSBib3hCYWNrZ3JvdW5kIDogQm94QmFja2dyb3VuZDtcclxuICAgIHByaXZhdGUgZm9udFNpemUgOiBudW1iZXIgPSAyNDtcclxuICAgIHByaXZhdGUgaGFzQWxyZWFkeUJlZW5EcmF3bk9uY2UgOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIGlkIDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBpbm5lck1hcmdpbiA6IFBvaW50ID0gbmV3IFBvaW50KDAsIDIwKTtcclxuICAgIHByaXZhdGUgcG9zaXRpb24gOiBQb2ludDtcclxuICAgIHByaXZhdGUgc2l6ZSA6IFBvaW50O1xyXG4gICAgcHJpdmF0ZSB0ZXh0IDogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGlkIDogbnVtYmVyLCB0ZXh0IDogc3RyaW5nLCB3aWR0aCA6IG51bWJlciwgcG9zaXRpb24gOiBQb2ludCkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG5cclxuICAgICAgICB0aGlzLnNpemUgPSBuZXcgUG9pbnQod2lkdGgsICh0aGlzLmZvbnRTaXplICogMS40Mjg1NykgKyAoMiAqIHRoaXMuaW5uZXJNYXJnaW4uWSkpO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuXHJcbiAgICAgICAgdGhpcy5ib3hCYWNrZ3JvdW5kID0gQm94QmFja2dyb3VuZEZhY3RvcnkuQ3JlYXRlKEJveEJhY2tncm91bmRUeXBlcy5DT0xPUiwgXCJyZ2JhKDAsIDAsIDAsIC43KVwiLCB0aGlzLnNpemUsIHRoaXMucG9zaXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBJZCgpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pZDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgQm91bmRpbmdSZWN0KCkgOiBJUmVjdCB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgUG9zaXRpb24gOiB0aGlzLnBvc2l0aW9uLFxyXG4gICAgICAgICAgICBTaXplIDogdGhpcy5zaXplXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMuaGFzQWxyZWFkeUJlZW5EcmF3bk9uY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5iZWZvcmVGaXJzdERyYXcoY2FudmFzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYm94QmFja2dyb3VuZC5EcmF3KGNhbnZhcyk7XHJcbiAgICAgICAgY2FudmFzLkRyYXdUZXh0KHRoaXMudGV4dCwgdGhpcy5wb3NpdGlvbi5BZGQodGhpcy5pbm5lck1hcmdpbiksIFwid2hpdGVcIiwgdGhpcy5mb250U2l6ZSwgdGhpcy5zaXplLlgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYmVmb3JlRmlyc3REcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcclxuICAgICAgICBjYW52YXMuRHJhd1RleHQwKFwiXCIsIFwidHJhbnNwYXJlbnRcIiwgdGhpcy5mb250U2l6ZSk7XHJcbiAgICAgICAgdGhpcy5pbm5lck1hcmdpbi5YID0gKHRoaXMuc2l6ZS5YIC0gY2FudmFzLk1lYXN1cmVUZXh0V2lkdGgodGhpcy50ZXh0KSkgLyAyO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hvaWNlTGF5ZXIgZXh0ZW5kcyBHYW1lcGxheUxheWVyIHtcclxuICAgIHByaXZhdGUgYm91bmRpbmdSZWN0IDogUG9pbnQ7XHJcbiAgICBwcml2YXRlIGNob2ljZUJveGVzIDogQ2hvaWNlQm94W10gPSBbXTtcclxuICAgIHByaXZhdGUgY2hvaWNlcyA6IENob2ljZVtdID0gW107XHJcbiAgICBwcml2YXRlIGlzTW91c2VPbkNob2ljZSA6IENob2ljZUJveCA9IG51bGw7XHJcbiAgICBwcml2YXRlIHNjcmVlblNpemUgOiBQb2ludDtcclxuICAgIHByaXZhdGUgdHJhbnNsYXRpb24gOiBQb2ludDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY3JlZW5TaXplIDogUG9pbnQpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLnNjcmVlblNpemUgPSBzY3JlZW5TaXplO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBDaG9pY2VzKGNob2ljZXMgOiBDaG9pY2VbXSkge1xyXG4gICAgICAgIHRoaXMuY2hvaWNlcyA9IGNob2ljZXM7XHJcblxyXG4gICAgICAgIHRoaXMuY2hvaWNlQm94ZXMgPSBbXTtcclxuICAgICAgICBjb25zdCB3aWR0aCA9IDIwMDtcclxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IG5ldyBQb2ludCgwLCAwKTtcclxuICAgICAgICBmb3IgKGNvbnN0IF9jaG9pY2Ugb2YgdGhpcy5jaG9pY2VzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld0Nob2ljZSA9IG5ldyBDaG9pY2VCb3goX2Nob2ljZS5pbmRleCwgX2Nob2ljZS50ZXh0LCB3aWR0aCwgcG9zaXRpb24uQ2xvbmUoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hvaWNlQm94ZXMucHVzaChuZXdDaG9pY2UpO1xyXG4gICAgICAgICAgICBwb3NpdGlvbi5ZICs9IG5ld0Nob2ljZS5Cb3VuZGluZ1JlY3QuU2l6ZS5ZICsgNDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYm91bmRpbmdSZWN0ID0gbmV3IFBvaW50KHdpZHRoLCBwb3NpdGlvbi5ZIC0gNDApO1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRpb24gPSB0aGlzLnNjcmVlblNpemUuRGl2KG5ldyBQb2ludCgyKSkuU3ViKHRoaXMuYm91bmRpbmdSZWN0LkRpdihuZXcgUG9pbnQoMikpKTtcclxuICAgIH1cclxuXHJcbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcclxuICAgICAgICBjYW52YXMuVHJhbnNsYXRlKHRoaXMudHJhbnNsYXRpb24pO1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hvaWNlQm94IG9mIHRoaXMuY2hvaWNlQm94ZXMpIHtcclxuICAgICAgICAgICAgY2hvaWNlQm94LkRyYXcoY2FudmFzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FudmFzLlJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBNb3VzZUNsaWNrKGNsaWNrUG9zaXRpb24gOiBQb2ludCwgYWN0aW9uIDogRnVuY3Rpb24pIDogdm9pZCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjaG9pY2VCb3ggb2YgdGhpcy5jaG9pY2VCb3hlcykge1xyXG4gICAgICAgICAgICBjb25zdCBib3VuZGluZ1JlY3QgPSBjaG9pY2VCb3guQm91bmRpbmdSZWN0O1xyXG4gICAgICAgICAgICBib3VuZGluZ1JlY3QuUG9zaXRpb24gPSBib3VuZGluZ1JlY3QuUG9zaXRpb24uQWRkKHRoaXMudHJhbnNsYXRpb24pO1xyXG4gICAgICAgICAgICBpZiAoY2xpY2tQb3NpdGlvbi5Jc0luUmVjdChib3VuZGluZ1JlY3QpKSB7XHJcbiAgICAgICAgICAgICAgICBhY3Rpb24oY2hvaWNlQm94LklkKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIE1vdXNlTW92ZShtb3VzZVBvc2l0aW9uIDogUG9pbnQpIDogKF8gOiBDYW52YXMpID0+IHZvaWQge1xyXG4gICAgICAgIG1vdXNlUG9zaXRpb24gPSBtb3VzZVBvc2l0aW9uLlN1Yih0aGlzLnRyYW5zbGF0aW9uKTtcclxuICAgICAgICBpZiAodGhpcy5pc01vdXNlT25DaG9pY2UgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbW91c2VQb3NpdGlvbi5Jc0luUmVjdCh0aGlzLmlzTW91c2VPbkNob2ljZS5Cb3VuZGluZ1JlY3QpID8gbnVsbCA6IChjYW52YXMgOiBDYW52YXMpID0+IHtcclxuICAgICAgICAgICAgICAgIGNhbnZhcy5TZXRDdXJzb3IoXCJkZWZhdWx0XCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc01vdXNlT25DaG9pY2UgPSBudWxsO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgY2hvaWNlIG9mIHRoaXMuY2hvaWNlQm94ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChtb3VzZVBvc2l0aW9uLklzSW5SZWN0KGNob2ljZS5Cb3VuZGluZ1JlY3QpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChjYW52YXMgOiBDYW52YXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc01vdXNlT25DaG9pY2UgPSBjaG9pY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbnZhcy5TZXRDdXJzb3IoXCJwb2ludGVyXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgU3RlcChkZWx0YSA6IG51bWJlcikgOiB2b2lkIHsgfVxyXG59XHJcbiIsImltcG9ydCB7IENhbnZhcyB9IGZyb20gXCIuLi9jYW52YXNcIjtcclxuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vcG9pbnRcIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBMYXllciB7XHJcbiAgICBhYnN0cmFjdCBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3RlcExheWVyIGV4dGVuZHMgTGF5ZXIge1xyXG4gICAgYWJzdHJhY3QgU3RlcChkZWx0YSA6IG51bWJlcikgOiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgR2FtZXBsYXlMYXllciBleHRlbmRzIFN0ZXBMYXllciB7XHJcbiAgICBhYnN0cmFjdCBNb3VzZUNsaWNrKGNsaWNrUG9zaXRpb24gOiBQb2ludCwgYWN0aW9uIDogRnVuY3Rpb24pIDogdm9pZDtcclxuICAgIGFic3RyYWN0IE1vdXNlTW92ZShtb3VzZVBvc2l0aW9uIDogUG9pbnQpIDogKF8gOiBDYW52YXMpID0+IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCAqIGZyb20gXCIuL2JhY2tncm91bmRcIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vY2hhcmFjdGVyc1wiO1xyXG5leHBvcnQgKiBmcm9tIFwiLi9jaG9pY2VsYXllclwiO1xyXG5leHBvcnQgKiBmcm9tIFwiLi9zcGVlY2hsYXllclwiO1xyXG5leHBvcnQgKiBmcm9tIFwiLi90cmFuc2l0aW9uXCI7XHJcbiIsImltcG9ydCB7IENhbnZhcyB9IGZyb20gXCIuLi9jYW52YXNcIjtcclxuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vcG9pbnRcIjtcclxuaW1wb3J0IHsgQm94QmFja2dyb3VuZCwgQm94QmFja2dyb3VuZEZhY3RvcnksIEJveEJhY2tncm91bmRUeXBlcyB9IGZyb20gXCIuL2JveGJhY2tncm91bmRzXCI7XHJcbmltcG9ydCB7IEdhbWVwbGF5TGF5ZXIgfSBmcm9tIFwiLi9sYXllcnNcIjtcclxuXHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuLi9jb25maWdcIjtcclxuXHJcbmludGVyZmFjZSBJQm94Q29uZmlndXJhdGlvbiB7XHJcbiAgICBCYWNrZ3JvdW5kIDogc3RyaW5nO1xyXG4gICAgQmFja2dyb3VuZFR5cGUgOiBCb3hCYWNrZ3JvdW5kVHlwZXM7XHJcbiAgICBGb250Q29sb3IgOiBzdHJpbmc7XHJcbiAgICBGb250U2l6ZSA6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU3BlZWNoQm94Q29uZmlndXJhdGlvbiBleHRlbmRzIElCb3hDb25maWd1cmF0aW9uIHtcclxuICAgIEhlaWdodCA6IG51bWJlcjtcclxuICAgIElubmVyTWFyZ2luIDogUG9pbnQ7XHJcbiAgICBPdXRlck1hcmdpbiA6IFBvaW50O1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSU5hbWVCb3hDb25maWd1cmF0aW9uIGV4dGVuZHMgSUJveENvbmZpZ3VyYXRpb24ge1xyXG4gICAgSGVpZ2h0IDogbnVtYmVyO1xyXG4gICAgV2lkdGggOiBudW1iZXI7XHJcbn1cclxuXHJcbmNvbnN0IFJFV1JBUF9USElTX0xJTkUgPSBcIjxbe1JFV1JBUF9USElTX0xJTkV9XT5cIjtcclxuXHJcbmNsYXNzIFNwZWVjaEJveCB7XHJcbiAgICBwcml2YXRlIGJveEJhY2tncm91bmQgOiBCb3hCYWNrZ3JvdW5kO1xyXG4gICAgcHJpdmF0ZSBmb250Q29sb3IgOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGZvbnRTaXplIDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBpbm5lck1hcmdpbiA6IFBvaW50O1xyXG4gICAgcHJpdmF0ZSBpbm5lclNpemUgOiBQb2ludDtcclxuICAgIHByaXZhdGUgbmV4dFdvcmQgOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHBvc2l0aW9uIDogUG9pbnQ7XHJcbiAgICBwcml2YXRlIHNpemUgOiBQb2ludDtcclxuICAgIHByaXZhdGUgdGV4dExpbmVzIDogW3N0cmluZ10gPSBbXCJcIl07XHJcblxyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb24gOiBQb2ludCwgc2l6ZSA6IFBvaW50LCBjb25maWd1cmF0aW9uIDogSVNwZWVjaEJveENvbmZpZ3VyYXRpb24pIHtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb24uQ2xvbmUoKTtcclxuICAgICAgICB0aGlzLnNpemUgPSBzaXplLkNsb25lKCk7XHJcbiAgICAgICAgdGhpcy5pbm5lck1hcmdpbiA9IGNvbmZpZ3VyYXRpb24uSW5uZXJNYXJnaW47XHJcbiAgICAgICAgdGhpcy5pbm5lclNpemUgPSB0aGlzLnNpemUuU3ViKHRoaXMuaW5uZXJNYXJnaW4uTXVsdChuZXcgUG9pbnQoMikpKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib3hCYWNrZ3JvdW5kID0gQm94QmFja2dyb3VuZEZhY3RvcnkuQ3JlYXRlKFxyXG4gICAgICAgICAgICBjb25maWd1cmF0aW9uLkJhY2tncm91bmRUeXBlLCBjb25maWd1cmF0aW9uLkJhY2tncm91bmQsXHJcbiAgICAgICAgICAgIHRoaXMuc2l6ZS5DbG9uZSgpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5mb250U2l6ZSA9IGNvbmZpZ3VyYXRpb24uRm9udFNpemU7XHJcbiAgICAgICAgdGhpcy5mb250Q29sb3IgPSBjb25maWd1cmF0aW9uLkZvbnRDb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgVGV4dCgpIDogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50ZXh0TGluZXMuam9pbihcIiBcIik7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IFRleHQodGV4dCA6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IF90ZXh0ID0gdGhpcy5UZXh0O1xyXG4gICAgICAgIGlmICh0ZXh0LmluZGV4T2YoX3RleHQpID09PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNsaWNlID0gdGV4dC5zbGljZShfdGV4dC5sZW5ndGgpO1xyXG4gICAgICAgICAgICB0aGlzLnRleHRMaW5lc1t0aGlzLnRleHRMaW5lcy5sZW5ndGggLSAxXSArPSBzbGljZTtcclxuICAgICAgICAgICAgaWYgKHNsaWNlLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV4dFdvcmQgPSBSRVdSQVBfVEhJU19MSU5FO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy50ZXh0TGluZXMgPSBbdGV4dF07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldCBOZXh0V29yZChuZXh0V29yZCA6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMubmV4dFdvcmQgPSBuZXh0V29yZDtcclxuICAgIH1cclxuXHJcbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcclxuICAgICAgICBjYW52YXMuVHJhbnNsYXRlKHRoaXMucG9zaXRpb24pO1xyXG5cclxuICAgICAgICB0aGlzLmJveEJhY2tncm91bmQuRHJhdyhjYW52YXMpO1xyXG5cclxuICAgICAgICBjYW52YXMuVHJhbnNsYXRlKHRoaXMucG9zaXRpb24uQWRkKHRoaXMuaW5uZXJNYXJnaW4pKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubmV4dFdvcmQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmRvVGhlV3JhcChjYW52YXMpO1xyXG4gICAgICAgICAgICB0aGlzLm5leHRXb3JkID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50ZXh0TGluZXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY2FudmFzLkRyYXdUZXh0KFxyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0TGluZXNbaV0sXHJcbiAgICAgICAgICAgICAgICBuZXcgUG9pbnQoMCwgaSAqICh0aGlzLmZvbnRTaXplICogMS40Mjg1NykpLCAvLyBUaGlzIGlzIHRoZSBnb2xkZW4gcmF0aW8sIG9uIGxpbmUtaGVpZ2h0IGFuZCBmb250LXNpemVcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9udENvbG9yLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5mb250U2l6ZSxcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJTaXplLlhcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNhbnZhcy5SZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkb1RoZVdyYXAoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xyXG4gICAgICAgIGNhbnZhcy5EcmF3VGV4dDAoXCJcIiwgXCJ0cmFuc3BhcmVudFwiLCB0aGlzLmZvbnRTaXplKTtcclxuICAgICAgICBjb25zdCBjb21wID0gKGxpbmUgOiBzdHJpbmcpID0+IGNhbnZhcy5NZWFzdXJlVGV4dFdpZHRoKGxpbmUpID4gdGhpcy5pbm5lclNpemUuWDtcclxuXHJcbiAgICAgICAgbGV0IGxhc3RMaW5lID0gdGhpcy50ZXh0TGluZXNbdGhpcy50ZXh0TGluZXMubGVuZ3RoIC0gMV07XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm5leHRXb3JkID09PSBSRVdSQVBfVEhJU19MSU5FKSB7XHJcbiAgICAgICAgICAgIC8vIE5lZWQgdG8gd3JhcCB0aGUgZnVjayBvdXQgb2YgdGhpcyBsaW5lXHJcbiAgICAgICAgICAgIHdoaWxlIChjb21wKGxhc3RMaW5lKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gR2V0IHRvIHRoZSBjaGFyIHdoZXJlIHdlJ3JlIG91dHNpZGUgdGhlIGJvdWRhcmllc1xyXG4gICAgICAgICAgICAgICAgbGV0IG4gPSAwO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKCFjb21wKGxhc3RMaW5lLnNsaWNlKDAsIG4pKSkgeyArK247IH1cclxuICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgcHJldmlvdXMgc3BhY2VcclxuICAgICAgICAgICAgICAgIHdoaWxlIChsYXN0TGluZVtuXSAhPT0gXCIgXCIgJiYgbiA+PSAwKSB7IC0tbjsgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG4gPT09IDApIHsgYnJlYWs7IH0gLy8gV2UgY2FuJ3Qgd3JhcCBtb3JlXHJcbiAgICAgICAgICAgICAgICAvLyBBcHBlbmQsIHVwZGF0ZSBsYXN0IGxpbmUsIGFuZCBiYWNrIGluIHRoZSBsb29wXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRMaW5lcy5wdXNoKGxhc3RMaW5lLnNsaWNlKG4gKyAxKSk7IC8vICsxIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0aGUgc3BhY2VcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dExpbmVzW3RoaXMudGV4dExpbmVzLmxlbmd0aCAtIDJdID0gbGFzdExpbmUuc2xpY2UoMCwgbik7XHJcbiAgICAgICAgICAgICAgICBsYXN0TGluZSA9IHRoaXMudGV4dExpbmVzW3RoaXMudGV4dExpbmVzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGNvbXAobGFzdExpbmUgKyB0aGlzLm5leHRXb3JkKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0TGluZXNbdGhpcy50ZXh0TGluZXMubGVuZ3RoIC0gMV0gPSBsYXN0TGluZS5zbGljZSgwLCBsYXN0TGluZS5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dExpbmVzLnB1c2goXCJcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIE5hbWVCb3gge1xyXG4gICAgcHJpdmF0ZSBiYWNrZ3JvdW5kVVJMIDogc3RyaW5nID0gXCJpbWFnZXMvOXBhdGNoLXNtYWxsLnBuZ1wiO1xyXG4gICAgcHJpdmF0ZSBib3hCYWNrZ3JvdW5kIDogQm94QmFja2dyb3VuZDtcclxuICAgIHByaXZhdGUgZm9udENvbG9yIDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBmb250U2l6ZSA6IG51bWJlcjtcclxuICAgIHByaXZhdGUgaW5uZXJNYXJnaW4gOiBQb2ludDtcclxuICAgIHByaXZhdGUgbmFtZSA6IHN0cmluZztcclxuICAgIHByaXZhdGUgcG9zaXRpb24gOiBQb2ludDtcclxuICAgIHByaXZhdGUgc2l6ZSA6IFBvaW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uIDogUG9pbnQsIGNvbmZpZ3VyYXRpb24gOiBJTmFtZUJveENvbmZpZ3VyYXRpb24pO1xyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb24gOiBQb2ludCwgY29uZmlndXJhdGlvbiA6IElOYW1lQm94Q29uZmlndXJhdGlvbiwgbmFtZT8gOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNpemUgPSBuZXcgUG9pbnQoY29uZmlndXJhdGlvbi5XaWR0aCwgY29uZmlndXJhdGlvbi5IZWlnaHQpO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbi5DbG9uZSgpO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24uWSAtPSB0aGlzLnNpemUuWTtcclxuXHJcbiAgICAgICAgdGhpcy5pbm5lck1hcmdpbiA9IHRoaXMuc2l6ZS5EaXYobmV3IFBvaW50KDEwLCAxMCkpO1xyXG5cclxuICAgICAgICB0aGlzLmZvbnRTaXplID0gY29uZmlndXJhdGlvbi5Gb250U2l6ZTtcclxuICAgICAgICB0aGlzLmZvbnRDb2xvciA9IGNvbmZpZ3VyYXRpb24uRm9udENvbG9yO1xyXG5cclxuICAgICAgICB0aGlzLmJveEJhY2tncm91bmQgPSBCb3hCYWNrZ3JvdW5kRmFjdG9yeS5DcmVhdGUoXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYXRpb24uQmFja2dyb3VuZFR5cGUsIGNvbmZpZ3VyYXRpb24uQmFja2dyb3VuZCxcclxuICAgICAgICAgICAgdGhpcy5zaXplLkNsb25lKClcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBOYW1lKG5hbWUgOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAobmFtZSAhPT0gdGhpcy5uYW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLm5hbWUubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjYW52YXMuVHJhbnNsYXRlKHRoaXMucG9zaXRpb24pO1xyXG4gICAgICAgICAgICB0aGlzLmJveEJhY2tncm91bmQuRHJhdyhjYW52YXMpO1xyXG4gICAgICAgICAgICBjYW52YXMuRHJhd1RleHQodGhpcy5uYW1lLCB0aGlzLmlubmVyTWFyZ2luLCB0aGlzLmZvbnRDb2xvciwgdGhpcy5mb250U2l6ZSwgdGhpcy5zaXplLlgpO1xyXG4gICAgICAgICAgICBjYW52YXMuUmVzdG9yZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNwZWVjaExheWVyIGV4dGVuZHMgR2FtZXBsYXlMYXllciB7XHJcbiAgICBwcml2YXRlIGZ1bGxUZXh0IDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBuYW1lQm94IDogTmFtZUJveDtcclxuICAgIHByaXZhdGUgdGV4dEFwcGVhcmVkIDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSB0ZXh0Qm94IDogU3BlZWNoQm94O1xyXG4gICAgcHJpdmF0ZSB0ZXh0VGltZSA6IG51bWJlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2NyZWVuU2l6ZSA6IFBvaW50LCBzcGVlY2hCb3hDb25maWd1cmF0aW9uIDogSVNwZWVjaEJveENvbmZpZ3VyYXRpb24pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICBjb25zdCB0ZXh0Qm94U2l6ZSA9IG5ldyBQb2ludChcclxuICAgICAgICAgICAgc2NyZWVuU2l6ZS5YIC0gKHNwZWVjaEJveENvbmZpZ3VyYXRpb24uT3V0ZXJNYXJnaW4uWCAqIDIpLFxyXG4gICAgICAgICAgICBzcGVlY2hCb3hDb25maWd1cmF0aW9uLkhlaWdodFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY29uc3QgdGV4dEJveFBvc2l0aW9uID0gbmV3IFBvaW50KFxyXG4gICAgICAgICAgICBzcGVlY2hCb3hDb25maWd1cmF0aW9uLk91dGVyTWFyZ2luLlgsXHJcbiAgICAgICAgICAgIHNjcmVlblNpemUuWSAtIHNwZWVjaEJveENvbmZpZ3VyYXRpb24uT3V0ZXJNYXJnaW4uWSAtIHNwZWVjaEJveENvbmZpZ3VyYXRpb24uSGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnRleHRCb3ggPSBuZXcgU3BlZWNoQm94KHRleHRCb3hQb3NpdGlvbiwgdGV4dEJveFNpemUsIHNwZWVjaEJveENvbmZpZ3VyYXRpb24pO1xyXG5cclxuICAgICAgICB0aGlzLm5hbWVCb3ggPSBuZXcgTmFtZUJveChcclxuICAgICAgICAgICAgdGV4dEJveFBvc2l0aW9uLkFkZChuZXcgUG9pbnQoNzAsIDApKSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQmFja2dyb3VuZCA6IHNwZWVjaEJveENvbmZpZ3VyYXRpb24uQmFja2dyb3VuZCxcclxuICAgICAgICAgICAgICAgIEJhY2tncm91bmRUeXBlIDogc3BlZWNoQm94Q29uZmlndXJhdGlvbi5CYWNrZ3JvdW5kVHlwZSxcclxuICAgICAgICAgICAgICAgIEZvbnRDb2xvciA6IFwid2hpdGVcIixcclxuICAgICAgICAgICAgICAgIEZvbnRTaXplIDogMjQsXHJcbiAgICAgICAgICAgICAgICBIZWlnaHQgOiA0MCxcclxuICAgICAgICAgICAgICAgIFdpZHRoIDogMTAwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xyXG4gICAgICAgIHRoaXMudGV4dEJveC5EcmF3KGNhbnZhcyk7XHJcbiAgICAgICAgdGhpcy5uYW1lQm94LkRyYXcoY2FudmFzKTtcclxuICAgIH1cclxuXHJcbiAgICBNb3VzZUNsaWNrKGNsaWNrUG9zaXRpb24gOiBQb2ludCwgYWN0aW9uIDogRnVuY3Rpb24pIDogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMudGV4dEFwcGVhcmVkKSB7XHJcbiAgICAgICAgICAgIGFjdGlvbigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dEJveC5UZXh0ID0gdGhpcy5mdWxsVGV4dDtcclxuICAgICAgICAgICAgdGhpcy50ZXh0QXBwZWFyZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBNb3VzZU1vdmUobW91c2VQb3NpdGlvbiA6IFBvaW50KSA6IChfIDogQ2FudmFzKSA9PiB2b2lkIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBTYXkodGV4dCA6IHN0cmluZywgbmFtZSA6IHN0cmluZykgOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnRleHRCb3guVGV4dCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5mdWxsVGV4dCA9IHRleHQ7XHJcbiAgICAgICAgdGhpcy50ZXh0QXBwZWFyZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5uYW1lQm94Lk5hbWUgPSBuYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIFN0ZXAoZGVsdGEgOiBudW1iZXIpIDogdm9pZCB7XHJcbiAgICAgICAgdGhpcy50ZXh0VGltZSArPSBkZWx0YTtcclxuXHJcbiAgICAgICAgd2hpbGUgKHRoaXMudGV4dFRpbWUgPj0gQ29uZmlnLlRleHRTcGVlZFJhdGlvKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRleHRCb3guVGV4dC5sZW5ndGggPCB0aGlzLmZ1bGxUZXh0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYyA9IHRoaXMuZnVsbFRleHQuc2xpY2UodGhpcy50ZXh0Qm94LlRleHQubGVuZ3RoLCB0aGlzLnRleHRCb3guVGV4dC5sZW5ndGggKyAxKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dEJveC5UZXh0ICs9IGM7XHJcbiAgICAgICAgICAgICAgICBpZiAoYyA9PT0gXCIgXCIgJiYgdGhpcy50ZXh0Qm94LlRleHQubGVuZ3RoICsgMiA8IHRoaXMuZnVsbFRleHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG4gPSB0aGlzLnRleHRCb3guVGV4dC5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuZnVsbFRleHRbbl0gPT09IFwiIFwiICYmIG4gPCB0aGlzLmZ1bGxUZXh0Lmxlbmd0aCkgeyArK247IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAobiA8IHRoaXMuZnVsbFRleHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmZ1bGxUZXh0W25dICE9PSBcIiBcIiAmJiBuIDwgdGhpcy5mdWxsVGV4dC5sZW5ndGgpIHsgKytuOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dEJveC5OZXh0V29yZCA9IHRoaXMuZnVsbFRleHQuc2xpY2UodGhpcy50ZXh0Qm94LlRleHQubGVuZ3RoICsgMSwgbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRBcHBlYXJlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMudGV4dFRpbWUgPSB0aGlzLnRleHRUaW1lIC0gQ29uZmlnLlRleHRTcGVlZFJhdGlvO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDYW52YXMgfSBmcm9tIFwiLi4vY2FudmFzXCI7XHJcbmltcG9ydCB7IExpdGVFdmVudCB9IGZyb20gXCIuLi9ldmVudHNcIjtcclxuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vcG9pbnRcIjtcclxuaW1wb3J0IHsgU3RlcExheWVyIH0gZnJvbSBcIi4vbGF5ZXJzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVHJhbnNpdGlvbiBleHRlbmRzIFN0ZXBMYXllciB7XHJcbiAgICBwcml2YXRlIF9vbkVuZCA6IExpdGVFdmVudDxUcmFuc2l0aW9uLCB2b2lkPiA9IG5ldyBMaXRlRXZlbnQ8VHJhbnNpdGlvbiwgdm9pZD4oKTtcclxuXHJcbiAgICBwcml2YXRlIGIgOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGltYWdlIDogSW1hZ2VCaXRtYXA7XHJcbiAgICBwcml2YXRlIHRpbWUgOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSB0b3RhbFRpbWUgOiBudW1iZXIgPSAyMDAwLjA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoaW1hZ2VEYXRhIDogSW1hZ2VEYXRhKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgLy8gc2luIGVxdWF0aW9uOiB5ID0gYSpzaW4oYip4ICsgYykgKyBkXHJcbiAgICAgICAgLy8gYSBzaW4gcGVyaW9kIGlzIDJQSSAvIGJcclxuICAgICAgICAvLyB3ZSB3YW50IGEgaGFsZiBwZXJpb2Qgb2YgdG90YWxUaW1lIHNvIHdlJ3JlIGxvb2tpbmcgZm9yIGI6IGIgPSAyUEkgLyBwZXJpb2RcclxuICAgICAgICB0aGlzLmIgPSAoTWF0aC5QSSAqIDIpIC8gKHRoaXMudG90YWxUaW1lICogMik7XHJcblxyXG4gICAgICAgIGNyZWF0ZUltYWdlQml0bWFwKGltYWdlRGF0YSkudGhlbihpbWFnZSA9PiB0aGlzLmltYWdlID0gaW1hZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBPbkVuZCgpIDogTGl0ZUV2ZW50PFRyYW5zaXRpb24sIHZvaWQ+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb25FbmQuRXhwb3NlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjYW52YXMuRHJhd0JhY2tncm91bmRJbWFnZSh0aGlzLmltYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNhbnZhcy5EcmF3UmVjdChuZXcgUG9pbnQoKSwgY2FudmFzLlNpemUsIGByZ2JhKDAuMCwgMC4wLCAwLjAsICR7TWF0aC5zaW4odGhpcy5iICogdGhpcy50aW1lKX0pYCk7XHJcbiAgICB9XHJcblxyXG4gICAgU3RlcChkZWx0YSA6IG51bWJlcikgOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnRpbWUgKz0gZGVsdGE7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmltYWdlICE9IG51bGwgJiYgdGhpcy50aW1lID49IHRoaXMudG90YWxUaW1lIC8gMikge1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRpbWUgPj0gdGhpcy50b3RhbFRpbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fb25FbmQuVHJpZ2dlcih0aGlzLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY2xhc3MgQ2xhc3NMb2FkZXIge1xyXG4gICAgTG9hZEltYWdlKFVSTCA6IHN0cmluZykgOiBQcm9taXNlPEltYWdlQml0bWFwPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlIDogRnVuY3Rpb24sIHJlamVjdCA6IEZ1bmN0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdvcmtlciA6IFdvcmtlciA9IHRoaXMuY3JlYXRlV29ya2VyKCk7XHJcblxyXG4gICAgICAgICAgICB3b3JrZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgKGV2dCA6IE1lc3NhZ2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGV2dC5kYXRhLmVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGV2dC5kYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHdvcmtlci50ZXJtaW5hdGUoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB3b3JrZXIucG9zdE1lc3NhZ2UoYCR7d2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZSgvW15cXFxcXFwvXSokLywgXCJcIil9JHtVUkx9YCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVXb3JrZXIoKSA6IFdvcmtlciB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBXb3JrZXIoVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbYChmdW5jdGlvbiAke3RoaXMud29ya2VyfSkoKWBdKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgd29ya2VyKCkge1xyXG4gICAgICAgIGNvbnN0IGN0eCA6IFdvcmtlciA9IHNlbGYgYXMgYW55O1xyXG4gICAgICAgIGN0eC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoZXZ0IDogTWVzc2FnZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGZldGNoKGV2dC5kYXRhKS50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmJsb2IoKSkudGhlbihibG9iRGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVJbWFnZUJpdG1hcChibG9iRGF0YSkudGhlbihpbWFnZSA9PiBjdHgucG9zdE1lc3NhZ2UoaW1hZ2UpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBMb2FkZXIgPSBuZXcgQ2xhc3NMb2FkZXIoKTtcclxuIiwiaW1wb3J0ICogYXMgSW5rSnMgZnJvbSBcImlua2pzXCI7XHJcbmltcG9ydCB7IEF1ZGlvLCBBdWRpb0ZhY3RvcnkgfSBmcm9tIFwiLi9hdWRpb1wiO1xyXG5pbXBvcnQgeyBDYW52YXMgfSBmcm9tIFwiLi9jYW52YXNcIjtcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vY29uZmlnXCI7XHJcbmltcG9ydCB7IEJveEJhY2tncm91bmRUeXBlcyB9IGZyb20gXCIuL2xheWVycy9ib3hiYWNrZ3JvdW5kc1wiO1xyXG5pbXBvcnQgKiBhcyBMYXllcnMgZnJvbSBcIi4vbGF5ZXJzL2xheWVyc1wiO1xyXG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuL3BvaW50XCI7XHJcbmltcG9ydCB7IFByZWxvYWRlciB9IGZyb20gXCIuL3ByZWxvYWRlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZOIHtcclxuICAgIEF1ZGlvIDogQXVkaW87XHJcbiAgICBDYW52YXMgOiBDYW52YXM7XHJcbiAgICBTdG9yeSA6IElua0pzLlN0b3J5O1xyXG5cclxuICAgIHByaXZhdGUgYmFja2dyb3VuZCA6IExheWVycy5CYWNrZ3JvdW5kO1xyXG4gICAgcHJpdmF0ZSBjaGFyYWN0ZXJzIDogTGF5ZXJzLkNoYXJhY3RlcnM7XHJcbiAgICBwcml2YXRlIGNob2ljZVNjcmVlbiA6IExheWVycy5DaG9pY2VMYXllcjtcclxuICAgIHByaXZhdGUgY3VycmVudFNjcmVlbiA6IExheWVycy5HYW1lcGxheUxheWVyO1xyXG4gICAgcHJpdmF0ZSBwcmV2aW91c1RpbWVzdGFtcCA6IG51bWJlcjtcclxuICAgIHByaXZhdGUgc3BlYWtpbmdDaGFyYWN0ZXJOYW1lIDogc3RyaW5nID0gXCJcIjtcclxuICAgIHByaXZhdGUgc3BlZWNoU2NyZWVuIDogTGF5ZXJzLlNwZWVjaExheWVyO1xyXG4gICAgcHJpdmF0ZSB0cmFuc2l0aW9uIDogTGF5ZXJzLlRyYW5zaXRpb247XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3RvcnlGaWxlbmFtZSA6IHN0cmluZywgY29udGFpbmVySUQgOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLkF1ZGlvID0gQXVkaW9GYWN0b3J5LkNyZWF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLkNhbnZhcyA9IG5ldyBDYW52YXMoY29udGFpbmVySUQsIENvbmZpZy5TY3JlZW5TaXplKTtcclxuXHJcbiAgICAgICAgZmV0Y2goc3RvcnlGaWxlbmFtZSkudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS50ZXh0KCkpLnRoZW4ocmF3U3RvcnkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLlN0b3J5ID0gbmV3IElua0pzLlN0b3J5KHJhd1N0b3J5KTtcclxuICAgICAgICAgICAgQ29uZmlnLkxvYWQodGhpcy5TdG9yeS5nbG9iYWxUYWdzIHx8IFtdKTtcclxuICAgICAgICAgICAgdGhpcy5DYW52YXMuU2l6ZSA9IENvbmZpZy5TY3JlZW5TaXplO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gbmV3IExheWVycy5CYWNrZ3JvdW5kKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVycyA9IG5ldyBMYXllcnMuQ2hhcmFjdGVycygpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zcGVlY2hTY3JlZW4gPSBuZXcgTGF5ZXJzLlNwZWVjaExheWVyKHRoaXMuQ2FudmFzLlNpemUsIHtcclxuICAgICAgICAgICAgICAgIEJhY2tncm91bmQgOiBcInJnYmEoMC4wLCAwLjAsIDAuMCwgMC43NSlcIixcclxuICAgICAgICAgICAgICAgIEJhY2tncm91bmRUeXBlIDogQm94QmFja2dyb3VuZFR5cGVzLkNPTE9SLFxyXG4gICAgICAgICAgICAgICAgRm9udENvbG9yIDogXCJ3aGl0ZVwiLFxyXG4gICAgICAgICAgICAgICAgRm9udFNpemUgOiAyNCxcclxuICAgICAgICAgICAgICAgIEhlaWdodCA6IDIwMCxcclxuICAgICAgICAgICAgICAgIElubmVyTWFyZ2luIDogbmV3IFBvaW50KDM1KSxcclxuICAgICAgICAgICAgICAgIE91dGVyTWFyZ2luIDogbmV3IFBvaW50KDUwKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5jaG9pY2VTY3JlZW4gPSBuZXcgTGF5ZXJzLkNob2ljZUxheWVyKHRoaXMuQ2FudmFzLlNpemUpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5DYW52YXMuT25DbGljay5Pbih0aGlzLm1vdXNlQ2xpY2suYmluZCh0aGlzKSk7XHJcbiAgICAgICAgICAgIHRoaXMuQ2FudmFzLk9uTW92ZS5Pbih0aGlzLm1vdXNlTW92ZS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29udGludWUoKTtcclxuICAgICAgICAgICAgdGhpcy5wcmV2aW91c1RpbWVzdGFtcCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdFN0ZXAoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNvbXB1dGVUYWdzKCkgOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBnZXRGaW5hbFZhbHVlID0gKHZhbHVlIDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlTWF0Y2ggPSB2YWx1ZS5tYXRjaCgvXlxceyhcXHcrKVxcfSQvKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlTWF0Y2ggIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuU3RvcnkudmFyaWFibGVzU3RhdGUuJCh2YWx1ZU1hdGNoWzFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgdGFncyA9IHRoaXMuU3RvcnkuY3VycmVudFRhZ3M7XHJcbiAgICAgICAgaWYgKHRhZ3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhZ3MubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gdGFnc1tpXS5tYXRjaCgvXihcXHcrKVxccyo6XFxzKiguKikkLyk7XHJcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2ggIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIG5lZWQgdG8ga25vdyB3aGF0IHRhZyBpdCBpc1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA6IHN0cmluZyA9IG1hdGNoWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlIDogc3RyaW5nID0gZ2V0RmluYWxWYWx1ZShtYXRjaFsyXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInByZWxvYWRcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUuc3BsaXQoXCIsXCIpLmZvckVhY2goX3ZhbHVlID0+IFByZWxvYWRlci5QcmVsb2FkKF92YWx1ZS50cmltKCkpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJiYWNrZ3JvdW5kXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZC5CYWNrZ3JvdW5kSW1hZ2UgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzcHJpdGVcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJhY3RlcnMuQWRkKHZhbHVlLCB0aGlzLkNhbnZhcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVycy5SZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJuYW1lXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3BlYWtpbmdDaGFyYWN0ZXJOYW1lID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYmdtXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5BdWRpby5QbGF5QkdNKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5BdWRpby5TdG9wQkdNKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2Z4XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQXVkaW8uUGxheVNGWCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwidHJhbnNpdGlvblwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb24gPSBuZXcgTGF5ZXJzLlRyYW5zaXRpb24odGhpcy5DYW52YXMuR2V0SW1hZ2VEYXRhKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uLk9uRW5kLk9uKChzZW5kZXIsIGFyZ3MpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb24gPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFVua25vd24gdGFncyBhcmUgdHJlYXRlZCBhcyBuYW1lc1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3BlYWtpbmdDaGFyYWN0ZXJOYW1lID0gZ2V0RmluYWxWYWx1ZSh0YWdzW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNvbnRpbnVlKCkgOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uICE9IG51bGwpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLlN0b3J5LmNhbkNvbnRpbnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuU3RvcnkuQ29udGludWUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLlN0b3J5LmN1cnJlbnRUZXh0LnJlcGxhY2UoL1xccy9nLCBcIlwiKS5sZW5ndGggPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250aW51ZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlVGFncygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zcGVlY2hTY3JlZW4uU2F5KHRoaXMuU3RvcnkuY3VycmVudFRleHQsIHRoaXMuc3BlYWtpbmdDaGFyYWN0ZXJOYW1lKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbiA9IHRoaXMuc3BlZWNoU2NyZWVuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLlN0b3J5LmN1cnJlbnRDaG9pY2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb21wdXRlVGFncygpO1xyXG4gICAgICAgICAgICB0aGlzLmNob2ljZVNjcmVlbi5DaG9pY2VzID0gdGhpcy5TdG9yeS5jdXJyZW50Q2hvaWNlcztcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuID0gdGhpcy5jaG9pY2VTY3JlZW47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gVE9ETyBJdCdzIHRoZSBlbmRcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtb3VzZUNsaWNrKHNlbmRlciA6IENhbnZhcywgY2xpY2tQb3NpdGlvbiA6IFBvaW50KSA6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLnRyYW5zaXRpb24gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U2NyZWVuIGluc3RhbmNlb2YgTGF5ZXJzLkNob2ljZUxheWVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbi5Nb3VzZUNsaWNrKGNsaWNrUG9zaXRpb24sIHRoaXMudmFsaWRhdGVDaG9pY2UuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuLk1vdXNlQ2xpY2soY2xpY2tQb3NpdGlvbiwgKCkgPT4gdGhpcy5jb250aW51ZSgpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtb3VzZU1vdmUoc2VuZGVyIDogQ2FudmFzLCBtb3VzZVBvc2l0aW9uIDogUG9pbnQpIDogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmN1cnJlbnRTY3JlZW4uTW91c2VNb3ZlKG1vdXNlUG9zaXRpb24pO1xyXG4gICAgICAgIGlmIChjYWxsYmFjayAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKHNlbmRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVxdWVzdFN0ZXAoKSA6IHZvaWQge1xyXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5zdGVwLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RlcCh0aW1lc3RhbXAgOiBudW1iZXIpIDogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZGVsdGEgPSB0aW1lc3RhbXAgLSB0aGlzLnByZXZpb3VzVGltZXN0YW1wO1xyXG4gICAgICAgIHRoaXMucHJldmlvdXNUaW1lc3RhbXAgPSB0aW1lc3RhbXA7XHJcblxyXG4gICAgICAgIHRoaXMuQ2FudmFzLkNsZWFyKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRyYW5zaXRpb24gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zaXRpb24uU3RlcChkZWx0YSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuLlN0ZXAoZGVsdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLkRyYXcodGhpcy5DYW52YXMpO1xyXG4gICAgICAgIHRoaXMuY2hhcmFjdGVycy5EcmF3KHRoaXMuQ2FudmFzKTtcclxuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uLkRyYXcodGhpcy5DYW52YXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbi5EcmF3KHRoaXMuQ2FudmFzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmVxdWVzdFN0ZXAoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHZhbGlkYXRlQ2hvaWNlKGNob2ljZUluZGV4IDogbnVtYmVyKSA6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuU3RvcnkuQ2hvb3NlQ2hvaWNlSW5kZXgoY2hvaWNlSW5kZXgpO1xyXG4gICAgICAgIHRoaXMuY29udGludWUoKTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgaW50ZXJmYWNlIElSZWN0IHtcclxuICAgIFBvc2l0aW9uIDogUG9pbnQ7XHJcbiAgICBTaXplIDogUG9pbnQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQb2ludCB7XHJcbiAgICBwcml2YXRlIHggOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIHkgOiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKTtcclxuICAgIGNvbnN0cnVjdG9yKHggOiBudW1iZXIpO1xyXG4gICAgY29uc3RydWN0b3IoeCA6IG51bWJlciwgeSA6IG51bWJlcik7XHJcbiAgICBjb25zdHJ1Y3Rvcih4PyA6IG51bWJlciwgeT8gOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB4ICE9IG51bGwgPyB4IDogMDtcclxuICAgICAgICB0aGlzLnkgPSB5ICE9IG51bGwgPyB5IDogeCAhPSBudWxsID8geCA6IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IFgoKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgWCh4IDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgWSgpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy55O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBZKHkgOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG5cclxuICAgIEFkZChwb2ludCA6IFBvaW50KSA6IFBvaW50IHtcclxuICAgICAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMuWCArIHBvaW50LlgsIHRoaXMuWSArIHBvaW50LlkpO1xyXG4gICAgfVxyXG5cclxuICAgIENsb25lKCkgOiBQb2ludCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLlgsIHRoaXMuWSk7XHJcbiAgICB9XHJcblxyXG4gICAgRGl2KHBvaW50IDogUG9pbnQpIDogUG9pbnQge1xyXG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5YIC8gcG9pbnQuWCwgdGhpcy5ZIC8gcG9pbnQuWSk7XHJcbiAgICB9XHJcblxyXG4gICAgSXNJblJlY3QocmVjdCA6IElSZWN0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuWCA+PSByZWN0LlBvc2l0aW9uLlggJiYgdGhpcy5YIDw9IHJlY3QuUG9zaXRpb24uQWRkKHJlY3QuU2l6ZSkuWFxyXG4gICAgICAgICAgICAmJiB0aGlzLlkgPj0gcmVjdC5Qb3NpdGlvbi5ZICYmIHRoaXMuWSA8PSByZWN0LlBvc2l0aW9uLkFkZChyZWN0LlNpemUpLlk7XHJcbiAgICB9XHJcblxyXG4gICAgTXVsdChwb2ludCA6IFBvaW50KSA6IFBvaW50IHtcclxuICAgICAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMuWCAqIHBvaW50LlgsIHRoaXMuWSAqIHBvaW50LlkpO1xyXG4gICAgfVxyXG5cclxuICAgIFN1Yihwb2ludCA6IFBvaW50KSA6IFBvaW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5BZGQobmV3IFBvaW50KC1wb2ludC5YLCAtcG9pbnQuWSkpO1xyXG4gICAgfVxyXG59XHJcbiIsImNsYXNzIENsYXNzUHJlbG9hZGVyIHtcclxuICAgIFByZWxvYWQodXJsIDogc3RyaW5nKSA6IHZvaWQge1xyXG4gICAgICAgIGZldGNoKHVybCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBQcmVsb2FkZXIgPSBuZXcgQ2xhc3NQcmVsb2FkZXIoKTtcclxuIl19
