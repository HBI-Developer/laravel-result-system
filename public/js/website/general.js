
// This's File contains variables and functions that uses in all system

/*
    @function diffrentFromNow
    @param time contains time needed to get diffrenance current time from it
    @param justPositive is true then negative value not return
    @return diffrent between (time) value and current time, if this deffrent negative and (justPositive) is true return 0
*/

let diffrentFromNow = (time = 0, justPositive = false) => {

        // @variable timeLeft contains diffrent (time) value and current time
        // @variable day contains this diffrent by day
        // @variable hour contains this diffrent by hours in this day
        // @variable minute contains this diffrent by minutes in this hour
        // @variable second contains this diffrent by seconds in this minutes

        let timeLeft = time - Date.now(),
            day = Math.floor(timeLeft / 86400000),
            hour = Math.floor((timeLeft % 86400000) / 3600000),
            minute = Math.floor((timeLeft % 3600000) / 60000),
            second = Math.floor((timeLeft % 60000) / 1000);

        if (justPositive) {

            // If justPositive is true

            if (day > 0 || hour > 0 || minute > 0 || second > 0) {

                // If any of this variables greater than 0

                // concat 0 with any variables has value equal or less than 9

                day = day > 9 ? day : '0' + day;
                hour = hour > 9 ? hour : '0' + hour;
                minute = minute > 9 ? minute : '0' + minute;
                second = second > 9 ? second : '0' + second;

                // return this value in array

                return [day, hour, minute, second];
            } {

                // If all variables equal or less than 0

                // return 0

                return 0;
            }
        }

        // return this value in array

        return [day, hour, minute, second];
    },

    /*
        @function attentionShow
        @param text contains string
        @void print message on screen with text
    */

    attentionShow = text => {

        // Append attention element in body with text

        $('body').append(`
            <div class="attention">${text}</div>
        `);

        // hide attention element after delay [2 seconds]

        $(".attention").delay(2000).fadeOut(400, function () {

            // After hide attention element remove it

            $(this).remove();
        });
    };