/*
    @function diffrentFromNow
    @param time contains time needed to get diffrenance current time from it
    @param justPositive is true then negative value not return
    @return diffrent between (time) value and current time, if this deffrent negative and (justPositive) is true return 0
*/

let diffrentFromNow = (time = 0, justPositive = false) => {

        let timeLeft = time - Date.now(),
            day = Math.floor(timeLeft / 86400000),
            hour = Math.floor((timeLeft % 86400000) / 3600000),
            minute = Math.floor((timeLeft % 3600000) / 60000),
            second = Math.floor((timeLeft % 60000) / 1000);

        if (justPositive) {

            if (day > 0 || hour > 0 || minute > 0 || second > 0) {

                day = day > 9 ? day : '0' + day;

                hour = hour > 9 ? hour : '0' + hour;

                minute = minute > 9 ? minute : '0' + minute;

                second = second > 9 ? second : '0' + second;

                return [day, hour, minute, second];

            } {

                return 0;

            }

        }

        return [day, hour, minute, second];

    },

    /*
        @function attentionShow
        @param text contains string
        @void print message on screen with text
    */

    attentionShow = text => {

        $('body').append(`
            <div class="attention">${text}</div>
        `);

        $(".attention").delay(2000).fadeOut(400, function () {

            $(this).remove();

        });
        
    };