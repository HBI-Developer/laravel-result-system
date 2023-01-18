<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Degree;

class Subject extends Model
{
    use HasFactory;
    protected $fillable = ['subject_name', 'specialization'];
    public $timestamps = false;

    public function degrees()
    {
        return $this->hasMany(Degree::class, 'subject_id', 'id');
    }

    public function students() {
        return $this->belongsToMany(Student::class, 'degrees', 'subject_id', 'student_id', 'id', 'ssn');
    }

    /********************************************** Accessors **********************************************/

    public function getSpecializationAttribute($value)
    {
        if ($value == 1) {
            return 'علمي';
        } else if ($value == 2) {
            return 'أدبي';
        }

        return 'مشترك';
    }

    /*******************************************************************************************************/

    /********************************************** Mutators ***********************************************/

    public function setSpecializationAttribute($value)
    {
        $result = 0;

        if ($value == 'علمي') {
            $result = 1;
        } else if ($value == 'أدبي') {
            $result = 2;
        }

        return $result;
    }

    /*******************************************************************************************************/
}
