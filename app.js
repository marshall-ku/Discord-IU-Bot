const {Client, MessageAttachment} = require('discord.js');
const fetch = require("node-fetch");
const token = require("./token.json");
const files = require("./files.json");
const client = new Client();

const pickRandom = array => {
    return array[Math.round(Math.random() * (array.length - 1))];
};
const pickImg = array => {
    return pickRandom(array).replace("[gfy]", "https://giant.gfycat.com/").replace("[zgfy]", "https://zippy.gfycat.com/").replace("[ten]", "https://tenor.com/view/").replace("[fgfy]", "https://fat.gfycat.com/").replace("[tgfy]", "https://thumbs.gfycat.com/");
};
const quickSort = (arr, l, r) => {
    let i;

    (l < r) &&
    (
        i =  partition(arr, l, r),

        quickSort(arr, l, i - 1),
        quickSort(arr, i + 1, r)
    )

    return arr
};
const partition = (arr, l, r) => {
    let i = l,
        j = r,
        pivot = arr[l];

    for (;i < j;)
    {
        for (;arr[j] > pivot;) j--;
        for (;i < j && arr[i] <= pivot;) i++;
        tmp = arr[i], arr[i] = arr[j], arr[j] = tmp
    }
    return arr[l] = arr[j], arr[j] = pivot, j
};
const parse = raw => {
    try {
        return JSON.parse(raw);
    }
    catch (err) {
        return false;
    }
};

client.on("ready", () => {
    console.log(`Logged in : ${client.user.tag}`);
    client.user.setPresence({
        activity: {
            name: "명령어 확인 : 지은아 도와줘"
        }
    });
});

client.on("message", msg => {
    let content = msg.content;

    if (content.startsWith("지은아")) {
        const author = msg.author;
        const user = msg.mentions.users.first();
        const member = user && msg.guild.member(user);
        content = content.slice(4);

        // If user typed nothing
        if (content === "") {
            msg.reply("``지은아 도와줘`` 명령어를 이용해 명령어 목록을 볼 수 있어요.")
        }

        // Help
        if (content === "도와줘") {
            msg.channel.send("지은아 [명령어] 구조로 이루어져 있습니다.\n말해 [문자] : 봇이 한 말을 따라 합니다. 마지막에 -지워를 붙이면 해당 메시지를 지우고 따라 합니다.\n정렬해줘 : 정렬해줘 [배열] 구조로 이루어져 있습니다.\n밴, 내쫓아 : 순서대로 ban, kick입니다. 내쫓아(밴) [@유저] [문자(밴 사유, 선택)]\n역할 : 역할 [행동(추가 / 삭제)] [@유저] [역할 이름]\n인스타 : 최근 인스타그램을 게시글을 표시해줍니다.\n유튜브 : 유튜브 링크를 표시합니다.\n뮤비 or 뮤직비디오 : 뮤직비디오 링크를 무작위로 표시합니다.\n게임 : 주사위, 동전\n\n 움짤 목록 : 안녕, 잘 가, ㅇㅋ, ㅠㅠ, ㅋㅋ, 굿, 헉, 열받네")
        }

        // Greeting, Farewell
        if (content === "안녕") {
            msg.react("💜")
            .then(() => {
                msg.channel.send(pickImg(files.hi));
            })
        }
        if (content === "잘 가" || content === "잘가") {
            msg.react("💜")
            .then(() => {
                msg.channel.send(pickImg(files.bye));
            })
        }

        // Sending GIFs(Videos)
        if (content === "ㅇㅋ") {
            msg.channel.send(pickImg(files.ok));
        }
        if (content === "ㅠㅠ") {
            msg.channel.send(pickImg(files.cry));
        }
        if (content === "ㅋㅋ") {
            msg.channel.send(pickImg(files.laugh));
        }
        if (content === "굿") {
            msg.channel.send(pickImg(files.good));
        }
        if (content === "헉") {
            msg.channel.send(pickImg(files.surprised));
        }
        if (content === "열받네") {
            msg.channel.send(pickImg(files.angry));
        }

        // Info
        if (content === "인스타") {
            fetch("https://www.instagram.com/dlwlrma/")
            .then(a => {
                return a.text()
            })
            .then(a => {
                const media = JSON.parse(a.slice(a.indexOf("edge_owner_to_timeline_media") + 30, a.indexOf("edge_saved_media") - 2));
                const recentPost = media.edges[0].node;
                const attachment = new MessageAttachment(recentPost.display_url);
                const recentPostComment = recentPost.edge_media_to_caption.edges[0].node.text;

                msg.channel.send(attachment)
                .then(() => {
                    msg.channel.send(`>>> ${recentPostComment}\n더 자세한 내용은 https://www.instagram.com/dlwlrma/ 로!`);
                })
            });            
        }
        if (content === "유튜브") {
            msg.channel.send("https://www.youtube.com/channel/UC3SyT4_WLHzN7JmHQwKQZww");
        }
        if (content === "뮤비" || content === "뮤직비디오") {
            msg.channel.send(`https://youtu.be/${pickRandom(files.mv)}`)
        }

        // Extra Functions
        if (content.startsWith("말해 ")) {
            if (content.slice(-3) === "-지워") {
                msg.delete();
                msg.channel.send(content.slice(0, -3).replace("말해 ", ""));
            }
            else {
                msg.channel.send(content.replace("말해 ", ""));
            }
        }
        if (content === "주사위") {
            const result = Math.floor(Math.random() * 5 + 1);
            msg.reply(`${result === 1 ? "⚀ (1)" : result === 2 ? "⚁ (2)" : result === 3 ? "⚂ (3)" : result === 4 ? "⚃ (4)" : result === 5 ? "⚄ (5)" : "⚅ (6)"}`);
        }
        if (content === "동전") {
            const result = Math.round(Math.random());
            msg.reply(`${result ? "앞" : "뒤"}`);
        }
        if (content === "집합시켜") {
            msg.channel.send(`@everyone ${author}님이 집합하시랍니다!`)
        }
        if (content.startsWith("정렬해줘")) {
            const array = content.match(/\[(.*)\]/g)[0];
            if (array) {
                const start = new Date().getTime();
                const parsed = parse(array) ;

                if (parsed) {
                    const sorted = quickSort(parsed, 0, parsed.length - 1);
                    msg.reply(`[${sorted}]\n정렬하는데 \`\`${new Date().getTime() - start}ms\`\`가 소요되었어요.`);
                }
                else {
                    msg.reply("정렬할 수 없는 배열이에요. 😥")
                }
            }
            else {
                msg.reply("지은아 정렬해줘 ``[배열]``로 정렬할 수 있어요.")
            }
        }

        // Moderation
        if (content.startsWith("역할")) {
            if (!msg.member.hasPermission("MANAGE_MEMBERS")) return msg.reply("수행할 권한이 없는 명령입니다!");
            if (!user) return msg.reply("누굴요?");

            if (member) {
                const sliced = content.split(" ");
                const action = sliced[1];
                if (!action || !sliced[2] || !sliced[3]) return msg.reply("역할 [행동(추가 / 삭제)] [@유저] [역할 이름]으로 사용하실 수 있어요.");
                const role = msg.guild.roles.cache.find(role => role.name === sliced.slice(3).join(" "));
                if (!role) return msg.reply("그런 역할은 없어요. 😥");

                if (action === "추가") {
                    if (member.roles.cache.has(role.id)) {
                        msg.reply("이미 역할이 부여되어있네요.")
                    }
                    else {
                        member.roles.add(role.id)
                        .then(() => {
                            msg.channel.send(`축하합니다! \`\`@${member.user.username}\`\`님! \`\`${role.name}\`\` 역할을 부여받았어요!`)
                        })
                        .catch(err => {
                            console.log(err);
                            msg.reply("역할 부여에 실패했어요. 😥");
                        })
                    }
                }
                if (action === "삭제") {
                    if (member.roles.cache.has(role.id)) {
                        member.roles.remove(role.id)
                        .then(() => {
                            msg.channel.send(`\`\`@${member.user.username}\`\` 님에게서 \`\`${role.name}\`\` 역할을 삭제했습니다.`)
                        })
                        .catch(err => {
                            console.log(err);
                            msg.reply("역할 삭제에 실패했어요. 😥");
                        })
                    }
                    else {
                        msg.reply("그런 역할은 부여되어 있지 않네요.")
                    }
                }
            }
            else {
                msg.reply("그런 사람은 없어요. 😥")
            }
        }
        if (content.startsWith("밴") || content.startsWith("내쫓아")) {
            if (!msg.member.hasPermission("MANAGE_MEMBERS")) return msg.reply("수행할 권한이 없는 명령입니다!");
            if (user) {
                const reason = content.match(/ /g)[1];
                if (member) {
                    if (content.startsWith("밴")) {
                        member
                        .ban({
                            reason: `${reason ? message.slice(message.lastIndexOf(" ")+1) : "나빴어"}`
                        })
                        .then(() => {
                            msg.reply(`${user.tag}을(를) 밴했어요.`)
                        })
                        .catch(() => {
                            msg.reply("이 사람은 밴할 수 없네요.")
                        })
                    }
                    else {
                        member
                        .kick({
                            reason: `${reason ? message.slice(message.lastIndexOf(" ")+1) : "나빴어"}`
                        })
                        .then(() => {
                            msg.reply(`${user.tag}을(를) 내쫓았어요.`)
                        })
                        .catch(() => {
                            msg.reply("이 사람은 내쫓을 수 없네요.")
                        })
                    }
                }
                else {
                    msg.reply("그런 사람은 없어요. 😥")
                }
            }
            else {
                msg.reply("누굴요?")
            }
        }
    }
});

client.login(token.token);
