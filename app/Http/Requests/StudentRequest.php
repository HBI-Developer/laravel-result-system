<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StudentRequest extends FormRequest
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
            "first_name"        => 'required',
            "middle_name"       => 'required',
            "last_name"         => 'required',
            "age"               => 'required|integer',
            "gender"            => 'required|integer',
            "school"            => 'required',
            "state"             => 'required|integer',
            "major"             => 'required|integer',
        ];
    }

    public function messages() {
        return [
            "first_name.required"       => 'لا يمكنك ترك هذا الحقل فارغاً.',
            "middle_name.required"      => 'لا يمكنك ترك هذا الحقل فارغاً.',
            "last_name.required"        => 'لا يمكنك ترك هذا الحقل فارغاً.',
            "age.required"              => 'لا يمكنك ترك هذا الحقل فارغاً.',
            "age.integer"               => 'يجب أن يحتوي هذا الحقل على أرقام فقط.',
            "gender.required"           => 'لا يمكنك ترك هذا الحقل فارغاً.',
            "gender.integer"            => 'يجب أن يحتوي هذا الحقل على أرقام فقط.',
            "school.required"           => 'لا يمكنك ترك هذا الحقل فارغاً.',
            "state.required"            => 'لا يمكنك ترك هذا الحقل فارغاً.',
            "state.integer"             => 'يجب أن يحتوي هذا الحقل على أرقام فقط.',
            "major.required"            => 'لا يمكنك ترك هذا الحقل فارغاً.',
            "major.integer"             => 'يجب أن يحتوي هذا الحقل على أرقام فقط.',
        ];
    }
}
