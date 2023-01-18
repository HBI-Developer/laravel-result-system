<?php

namespace App\Http\Requests;

use App\Rules\DegreeRule;
use Illuminate\Foundation\Http\FormRequest;

class DegreeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            "student"   => 'required|integer|exists:students,ssn',

            // validate degrees by custom rule
            
            "degrees"    => [new DegreeRule]
        ];
    }

    public function messages()
    {
        return [
            "student.required"  => 'لا يمكنك ترك هذا الحقل فارغاً.',
            "student.integer"   => 'يجب أن يحتوي هذا الحقل على أرقام فقط.',
            "student.exists"   => 'هذا الطالب غير موجود.',
        ];
    }
}
