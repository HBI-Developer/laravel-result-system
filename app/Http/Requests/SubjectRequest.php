<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubjectRequest extends FormRequest
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
            'subject_name'  => "required",
            'major'         => 'required|integer'
        ];
    }

    public function messages() {
        return [
            'subject_name.required' => 'لا يمكنك ترك هذا الحقل فارغاً.',
            'major.required'        => 'لا يمكنك ترك هذا الحقل فارغاً.',
            'major.integer'         => 'يجب أن يحتوي هذا الحقل على أرقام فقط.'
        ];
    }
}
