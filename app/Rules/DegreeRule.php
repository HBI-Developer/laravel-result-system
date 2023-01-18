<?php

namespace App\Rules;

use App\Models\Subject;
use Illuminate\Contracts\Validation\InvokableRule;
use Mockery\Undefined;

class DegreeRule implements InvokableRule
{
    /**
     * Run the validation rule.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     * @return void
     */
    public function __invoke($attribute, $value, $fail)
    {
        $degreesObject = collect(json_decode($value));

        // Super Global error variable

        $GLOBALS['error'] = '';

        $degreesObject -> each(function($item, $key) {

            // Local error variable

            $error = '';
            if (mb_strlen(trim($key)) === 0 || $key === "undefined") {

                // If any sending subject ID is empty return error code

                $error = 'er100';
            } else if (!is_numeric($key)) {

                // If any sending subject ID is NOT number return error code

                $error = 'er101';
            } else if (!Subject::find($key)) {

                // If any sending subject ID is not exists in subjects table return this's ID

                $error = $key;
            } else if (mb_strlen(trim($item)) === 0) {

                // If degree of subject is empty return error code

                $error = 'er102';
            } else if (!is_numeric($item)) {

                // If degree of subject is NOT number return error code
                
                $error = 'er103';
            } else if ($item > 100) {

                // If degree of subject greater than from 100 return error code

                $error = 'er104';
            } else if ($item < 0) {

                // If degree of subject greater than from 100 return error code

                $error = 'er105';
            }
            
            if ($error !== '') {

                // If return any error code or subject ID assigning it to global error variable and stop the itration

                $GLOBALS['error'] = $error;
                return false;
            }

        });

        if ($GLOBALS['error'] !== '') {

            // If super global error variable is not empty then the rule is fail

            $fail($GLOBALS['error']);
        }
    }
}
