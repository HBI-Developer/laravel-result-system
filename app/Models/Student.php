<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\Degree;

class Student extends Authenticatable
{
    use HasFactory;
    protected $primaryKey = 'ssn';
    protected $fillable = ['ssn', 'first_name', 'middle_name', 'last_name', 'age', 'gender', 'school', 'state', 'sitting_number', 'specialization'];
    public $timestamps = false;

    public function degrees() {
        return $this -> hasMany(Degree::class, 'student_id', 'ssn');
    }

    public function subjects() {
        return $this->belongsToMany(Subject::class, 'degrees', 'student_id', 'subject_id', 'ssn', 'id');
    }

    /********************************************** Accessors **********************************************/

    public function getGenderAttribute($value) {
        return $value == 1 ? 'ذكر' : 'أنثى';
    }

    public function getStateAttribute($value) {
        $number = intval($value);
        $number--;

        return STATES[$number];
    }

    public function getSpecializationAttribute($value) {
        return $value == 1 ? 'علمي' : 'أدبي';
    }

    /*******************************************************************************************************/

    /********************************************** Mutators ***********************************************/

    public function setStateAttribute($value) {
        
        $result = STATES->search($value) ? STATES->search($value) + 1 : 1;
        return $result;
    }

    public function setGenderAttribute($value) {

        $result = $value === 'أنثى' ? 2 : 1;

        return $result;
    }

    public function setSpecializationAttribute($value) {

        $result = $value === 'أدبي' ? 2 : 1;

        return $result;
    }

    /*******************************************************************************************************/

    public function getFullNameAttribute() {
        return $this->first_name . ' ' . $this->middle_name . ' ' . $this->last_name;
    }
}
