<?php

namespace App\Rules;

use App\Models\Subject;
use Illuminate\Contracts\Validation\InvokableRule;

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

        $GLOBALS['error'] = '';

        $degreesObject->each(function ($item, $key) {

            $error = '';

            if (mb_strlen(trim($key)) === 0 || $key === "undefined") {

                $error = 'er100';
            } else if (!is_numeric($key)) {

                $error = 'er101';
            } else if (!Subject::find($key)) {

                $error = $key;
            } else if (mb_strlen(trim($item)) === 0) {

                $error = 'er102';
            } else if (!is_numeric($item)) {

                $error = 'er103';
            } else if ($item > 100) {

                $error = 'er104';
            } else if ($item < 0) {

                $error = 'er105';
            }

            if ($error !== '') {

                $GLOBALS['error'] = $error;

                return false;
            }
        });

        if ($GLOBALS['error'] !== '') {

            $fail($GLOBALS['error']);
        }
    }
}
