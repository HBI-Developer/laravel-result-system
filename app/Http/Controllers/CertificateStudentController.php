<?php

namespace App\Http\Controllers;

use App\Models\Degree;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Support\Facades\Auth;

class CertificateStudentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:student');
    }


    public function certificate()
    {
        $student_info = Auth::guard('student')->user();

        $student = Degree::whereBelongsTo($student_info)->with('subject')->get();

        $state = Subject::with(['degrees' => function ($query) {
            $students = Student::where('state', STATES->search(Auth::guard('student')->user()->state) + 1)->get();
            $query->whereBelongsTo($students);
        }])->select('id', 'subject_name')->get();

        $all = Subject::withAvg('degrees as degree', 'degree')->get();

        $statistics = collect([]);

        foreach ($student as $degree) {
            $GLOBALS['subject'] = $degree->subject->subject_name;

            $state_degree = $state->filter(function ($item) {
                return $item->subject_name === $GLOBALS['subject'];
            });

            $all_degree = $all->filter(function ($item) {
                return $item->subject_name === $GLOBALS['subject'];
            });

            $statistics->push([
                'subject' => $GLOBALS['subject'],
                'student' => $degree->degree,
                'state' => round($state_degree->first()->degrees->avg('degree'), 2),
                'all' => round($all_degree->first()->degree, 2)
            ]);
        }

        return view('student.certificate', compact('student', 'statistics'));
    }
}
