<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
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
            'NOM' => ['required', 'string'],
            'PRENOM' => ['required', 'string', 'min:3'],
            'LOGIN' => ['required', 'string', 'unique:utilisateur'],
            'PASSWORD' => ['required', 'string', 'min:6'],
            'ROLE' => ['required', 'string', 'in:dieteticien,cuisinier,distributeur,admin'],

            // validation de données du dieteticien :
            'NUM_LICENCE' => ['required_if:ROLE,dieteticien', 'string'],

            // validation de données du cuisinier : 
            'TYPE_CUISINE' => ['required_if:ROLE,cuisinier', 'string'],

            // validation de données de distributeur :
            'NUM_BADGE' => ['required_if:ROLE,distributeur', 'string'],
        ];
    }
}
