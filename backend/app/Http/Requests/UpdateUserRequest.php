<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
            'NOM' => ['sometimes', 'string'],
            'PRENOM' => ['sometimes', 'string', 'min:3'],
            'DATE_NAISSANCE' => ['sometimes', 'date'],
            'TELEPHONE' => ['sometimes', 'string', 'regex:/^(0|\+212)[67]\d{8}$/'],
            'GENRE' => ['sometimes', 'string', 'in:homme,femme'],
            'EMAIL' => ['sometimes', 'email', 'unique:personne,EMAIL'],
            'LOGIN' => ['sometimes', 'string', 'unique:utilisateur'],
            'PASSWORD' => ['sometimes', 'string', 'nullable'],
            'ROLE' => ['sometimes', 'string', 'in:dieteticien,cuisinier,distributeur,admin'],

            // validation de données du dieteticien :
            'NUM_LICENCE' => ['sometimes',  'string'],

            // validation de données du cuisinier : 
            'TYPE_CUISINE' => ['sometimes', 'string'],

            // validation de données de distributeur :
            'NUM_BADGE' => ['sometimes', 'string'],
        ];
    }
}
