
namespace SpriteKind {
    //% isKind
    export const NPC = SpriteKind.create()
    //% isKind
    export const Complete = SpriteKind.create()
    //% isKind
    export const Bucket = SpriteKind.create()
}

// Set walled tilemap so that character 
// doesn't fall through the floor
tiles.setCurrentTilemap(tilemap`court_floor`)


namespace globetrotters {

    let mySprite2: Ball = null

    // Enums to choose which player to add as NPC
    export enum NPCnum {
        //% block="Wham"
        WHAM=0,
        //% block="TNT"
        Tnt=1,
        //% block="Jet"
        JET=2,
        //% block="Coach"
        COACH=3,
        //% block="Cheese"
        CHEESE=4,
        //% block="Hotshot"
        HOTSHOT=5,
        //% block="Torch"
        TORCH=6
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
    //% thisImg.shadow=globe_image_picker
    //% help=github:docs/set_level_2
    export function setLevel2(thisImg: Image) {
        scroller.setBackgroundScrollOffset(0, 0)
        scroller.scrollBackgroundWithSpeed(0, 0)
        scene.setBackgroundImage(assets.image`court`)
        let hoop = sprites.create(assets.image`Net`, SpriteKind.Bucket)
        hoop.setPosition(133, 43)
        mySprite2 = carnival.create(thisImg, SpriteKind.Player, 55, 80)
        mySprite2.setTraceMulti(carnival.Tracers.Part)
        mySprite2.controlBallWithArrowKeys(true)
        scene.centerCameraAt(80, 60)
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
        teammate.setPosition(224 * num, 72)
        teammate.sayText("Hi!  I'm " + globetrotters.character[thisChoice])
    }



    /**
    * Initiates the question cycle for the appropriate NPC
    */
    //% blockId=ask_question
    //% block="ask question from $thisSprite"
    //% thisSprite.defl=otherSprite
    //% help=github:docs/ask_question
    export function askQuestion(thisSprite: Sprite) {
        thisSprite.setKind(SpriteKind.Complete)
        thisSprite.sayText(" ")
        let thisNPC = sprites.readDataNumber(thisSprite, "npcNum") % question_list.length
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
        pause(50)
    }



    /**
    * Initiates the question cycle for the appropriate NPC
    */
    //% blockId=npc_number
    //% block="get NPC number from $thisSprite"
    //% thisSprite.defl=otherSprite
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
    //% thisImg.shadow=globe_image_picker
    //% help=github:docs/toss_ball
    export function tossBall(thisImg: Image) {
        if (mySprite2) {
            mySprite2.pow += randint(-20, 20)
            let myBall = carnival.createProjectileBallFromSprite(thisImg, mySprite2)
        }
    }

}

namespace images {


    /**
     * An image
     * @param image the image
     */
    //% blockId=globe_image_picker block="%image" shim=TD_ID
    //% image.fieldEditor="images"
    //% image.fieldOptions.columns=6
    //% image.fieldOptions.width=600
    //% img.fieldOptions.filter="globe"
    //% weight=0 group="Create"
    export function _imageGlobe(image: Image): Image {
        return image;
    }

}

    
