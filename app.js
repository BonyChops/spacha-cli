#! /usr/bin/env node

const commandLineArgs = require('command-line-args');
const commandLineUsage = require("command-line-usage");
const { SpachaImage } = require("spacha");
const fs = require("fs");
const Canvas = require("canvas");
const Image = Canvas.Image;
const optionDefinitions = [
    { name: 'width', alias: 'w', type: Number },
    { name: 'height', alias: 'h', type: Number },
    { name: 'heightAutoFix', type: Boolean },
    { name: 'price', alias: 'p', type: Number },
    { name: 'customPriceString', type: String },
    { name: 'message', alias: "m", type: String },
    { name: 'theme', alias: "t", type: String },
    { name: "user.name", type: String },
    { name: "user.image", type: String },
    { name: "imgOption.square", type: Boolean },
    { name: 'background', type: String },
    { name: 'src', type: String, defaultOption: true },
];

const sections = [
    {
        header: "spacha-cli",
        content: "YouTube superchat like image generator."
    },
    {
        header: 'Synopsis',
        content: [
          '$ spacha [{underline options}] <{bold targetpath}>',
        ]
      },
    {
        header: "Options",
        optionList: [
            { name: 'width', alias: 'w', typeLabel: '{underline width}', description: "Set a width of image. Default is 600"},
            { name: 'height', alias: 'h', typeLabel: '{underline height}', description: "Set a height of image. Default is 300"},
            { name: 'heightAutoFix', typeLabel: '{underline [true|false]}', description: "Make tool decides a height of image. Default is true" },
            { name: 'price', alias: 'p', typeLabel: '{underline price}', description: "Set a price of spacha."},
            { name: 'customPriceString', typeLabel: '{underline customPriceString}', description: "Set a custom string for price section." },
            { name: 'message', alias: "m", typeLabel: '{underline message}', description: "Set a message of spacha." },
            { name: 'theme', alias: "t", typeLabel: '{underline theme}', description: "Set a theme of spacha. 'blue' | 'lightblue' | 'green' | 'yellow' | 'orange' | 'pink' | 'red'" },
            { name: "user.name", typeLabel: '{underline username}', description: "Set a username of spacha." },
            { name: "user.image", typeLabel: '{underline [filepath|URL]}', description: "Set a icon of spacha." },
            { name: "imgOption.square", typeLabel: '{underline [true|false]}', description: "Make icon square."},
        ]
    }
]

const options = commandLineArgs(optionDefinitions);


const saveImg = (canvas) => {
    const b64 = canvas.toDataURL().split(",")[1];
    const buf = Buffer.from(b64, 'base64');
    fs.writeFileSync(options.src, buf);
}

(async () => {
    if (!options.src) {
        console.log(commandLineUsage(sections));
        return;
    }
    const canvas = new Canvas.Canvas(600, 300);
    const ctx = canvas.getContext("2d");
    const iconImg = new Image;
    if (options["user.image"]) {
        iconImg.src = options["user.image"];
        await new Promise((resolve) => { iconImg.onload = resolve });
        options.user ??= {};
        options.user.img = iconImg;
    }
    if (options["user.name"]) {
        options.user ??= {};
        options.user.name = options["user.name"];
    }
    if (options["imgOption.square"]) {
        options.imgOption ??= {};
        options.imgOption.square = options["imgOption.square"];
    }
    new SpachaImage(ctx, options);

    saveImg(canvas);
})();
