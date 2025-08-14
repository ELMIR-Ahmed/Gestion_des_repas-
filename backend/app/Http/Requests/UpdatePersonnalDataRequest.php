<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePersonnalDataRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'DATE_NAISSANCE' => ['required', 'date'],
            'TELEPHONE' => ['required', 'string', 'regex:/^(0|\+212)[67]\d{8}$/'],
            'GENRE' => ['required', 'string', 'in:homme,femme'],
            'EMAIL' => ['required', 'email', 'unique:personne,EMAIL']
        ];
    }
}
