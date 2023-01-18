<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Student;
use App\Models\Subject;

class Degree extends Model
{
    use HasFactory;
    protected $fillable = ['student_id', 'subject_id', 'degree'];
    public $timestamps = false;

    public function student() {
        return $this -> belongsTo(Student::class, 'student_id', 'ssn');
    }

    public function subject() {
        return $this -> belongsTo(Subject::class, 'subject_id', 'id');
    }
}
