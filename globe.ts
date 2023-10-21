


namespace SpriteKind {
    //% isKind
    export const NPC = SpriteKind.create()
    //% isKind
    export const Complete = SpriteKind.create()
    //% isKind
    export const Bucket = SpriteKind.create()
}


/**
* For the Globetrotters Tutorial
*/
//% color=#151515 icon="\uf434"
namespace globetrotters {

    let mySprite2: Ball = null
    let spritesTalkedTo = 0;

    // Enums to choose which player to add as NPC
    export enum NPCnum {
        //% block="Wham"
        WHAM = 0,
        //% block="TNT"
        Tnt = 1,
        //% block="Jet"
        JET = 2,
        //% block="Coach"
        COACH = 3,
        //% block="Cheese"
        CHEESE = 4,
        //% block="Hotshot"
        HOTSHOT = 5,
        //% block="Torch"
        TORCH = 6
    }


    export let question_list = [
        "Who founded the Harlem Globetrotters?",
        "The Harlem Globetrotters played in Harlem, New York for the first time in what year?",
        "Who was the first woman to play for the Harlem Globetrotters?",
        "In how many countries and territories have the Harlem Globetrotters performed in their history?"
    ]
    export let answer_list = [
        ["Barack Obama", "Abe Saperstein"],
        ["1968", "1926"],
        ["TNT Lister", "Lynette Woodard"],
        ["124", "134"]
    ]
    export let correct_answers = [
        "Abe Saperstein",
        "1968",
        "Lynette Woodard",
        "124"
    ]
    export let character = [
        "Wham",
        "TNT",
        "Jet",
        "Coach",
        "Cheese",
        "Hotshot",
        "Torch"
    ]
    export let list = [
        globe_animations.wham_standing,
        globe_animations.tnt_standing,
        globe_animations.jet_standing,
        globe_animations.coach_standing,
        globe_animations.cheese_standing,
        globe_animations.hotshot_standing,
        globe_animations.torch_standing
    ]

    /**
    * Sets up the hoops level
    */
    //% blockId=set_level_2
    //% block="set level 2 using player $thisImg"
    //% thisImg.defl=globe_animations.tnt
    //% thisImg.shadow=screen_image_picker_globe
    //% help=github:docs/set_level_2
    export function setLevel2(thisImg: Image) {
        scroller.setBackgroundScrollOffset(0, 0)
        scroller.scrollBackgroundWithSpeed(0, 0)
        scene.setBackgroundImage(globe_imgs.court)
        let hoop = sprites.create(globe_imgs.net, SpriteKind.Bucket)
        hoop.setPosition(133, 43)
        mySprite2 = carnival.create(thisImg, SpriteKind.Player, 55, 80)
        mySprite2.setTraceMulti(carnival.Tracers.Part)
        mySprite2.controlBallWithArrowKeys(true)
        scene.centerCameraAt(80, 60)
        pause(100)
        game.showLongText("Press B to shoot the basketballs. \n You must get to 200 points!",
            DialogLayout.Bottom)
        effects.confetti.startScreenEffect(500)
        info.startCountdown(45)
    }


    /**
    * Adds the NPC of your choosing
    */
    //% blockId=set_npc
    //% block="set $thisChoice as NPC $num"
    //% thisChoice.defl=NPCnum.WHAM
    //% num.defl=1
    //% num.min=1 num.max=4
    //% help=github:docs/set_npc
    export function setNPC(num: number, thisChoice: NPCnum) {
        let frames = globetrotters.list[thisChoice]
        for (let index = 0; index <= frames.length - 1; index++) {
            frames[index].flipX()
        }
        let teammate = sprites.create(globetrotters.list[thisChoice][0], SpriteKind.NPC)
        sprites.setDataString(teammate, "name", globetrotters.character[thisChoice])
        sprites.setDataNumber(teammate, "npcNum", num - 1)
        animation.runImageAnimation(
            teammate,
            globetrotters.list[thisChoice],
            200,
            true
        )
        teammate.setPosition(224 * num, 87)
        teammate.sayText("Hi!  I'm " + globetrotters.character[thisChoice])
    }



    /**
    * Initiates the question cycle for the appropriate NPC
    */
    //% blockId=ask_question
    //% block="ask question from $thisSprite"
    //% thisSprite.shadow=variables_get
    //% help=github:docs/ask_question
    export function askQuestion(thisSprite: Sprite) {
        thisSprite.setKind(SpriteKind.Complete)
        thisSprite.sayText(" ")
        let thisNPC = sprites.readDataNumber(thisSprite, "npcNum") % question_list.length
        spritesTalkedTo += 1; 
        game.showLongText(question_list[thisNPC], DialogLayout.Bottom)
        story.showPlayerChoices(answer_list[thisNPC][0], answer_list[thisNPC][1])
        if (story.checkLastAnswer(correct_answers[thisNPC])) {
            info.changeScoreBy(10)
            music.play(music.melodyPlayable(music.magicWand), music.PlaybackMode.UntilDone)
            sprites.destroy(thisSprite, effects.confetti, 100)
        } else {
            music.play(music.melodyPlayable(music.buzzer), music.PlaybackMode.UntilDone)
            sprites.destroy(thisSprite)
        }

    }



    /**
    * Initiates the question cycle for the appropriate NPC
    */
    //% blockId=npc_number
    //% block="get NPC number from $thisSprite"
    //% thisSprite.shadow=variables_get
    //% help=github:docs/npc_number
    export function NPCNumberOf(thisSprite: Sprite) {

        return sprites.readDataNumber(thisSprite, "npcNum") + 1
    }


    /**
    * Sets up the hoops level
    */
    //% blockId=toss_ball
    //% block="toss $thisImg"
    //% thisImg.defl=globe_imgs.ball
    //% thisImg.shadow=screen_image_picker_globe
    //% help=github:docs/toss_ball
    export function tossBall(thisImg: Image) {
        if (mySprite2) {
            mySprite2.pow += randint(-20, 20)
            let myBall = carnival.createProjectileBallFromSprite(thisImg, mySprite2)
        }
    }



    /**
    * Freeze player and ask question
    */
    //% blockId=ask_question2
    //% block="$thatSprite ask $thisSprite a question"
    //% thisSprite.shadow=variables_get
    //% thatSprite.shadow=variables_get
    //% help=github:docs/ask_question2
    export function askQuestion2(thisSprite:Sprite, thatSprite:Sprite) {
        controller.moveSprite(thisSprite, 0, 0)
        globetrotters.askQuestion(thatSprite)
        controller.moveSprite(thisSprite, 100, 0)
    }


    /**
    * Check if ready for level 2
    */
    //% blockId=check_score
    //% block="player gets $thisNum"
    //% thisNum.defl=30
    //% help=github:docs/check_score
    export function checkScore(thisNum: number) {
        if (spritesTalkedTo >= 4) {
            if (info.score() >= thisNum) {
                return true;
            } else {
                music.play(music.melodyPlayable(music.wawawawaa), music.PlaybackMode.UntilDone)
                game.showLongText("TRY AGAIN! \n You need 31 points to get to the basketball court. \n YOU GOT THIS!!!", DialogLayout.Full)
                game.reset();
                return false;
            }
        } else { return false;}
    }


}


/**
 * Image manipulation blocks
 */
//% weight=70 icon="\uf03e" color="#a5b1c2"
//% advanced=true
namespace images {
    //% blockId=screen_image_picker_globe block="%img"
    //% shim=TD_ID
    //% img.fieldEditor="sprite"
    //% img.fieldOptions.taggedTemplate="img"
    //% img.fieldOptions.decompileIndirectFixedInstances="true"
    //% img.fieldOptions.decompileArgumentAsString="true"
    //% img.fieldOptions.filter="globe !tile !dialog !background"
    //% weight=100 group="Create" duplicateShadowOnDrag
    export function _spriteImageGlobe(img: Image) {
        return img
    }
}

