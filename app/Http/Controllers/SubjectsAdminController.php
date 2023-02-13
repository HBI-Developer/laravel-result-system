<?php

namespace App\Http\Controllers;

use App\Models\Degree;
use App\Models\Student;
use App\Models\Subject;
use App\Http\Requests\SubjectRequest;

class SubjectsAdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:admin');
    }


    public function subjects()
    {
        $subjects = Subject::get();

        return view('admin.subjects', compact('subjects'));
    }


    public function addNewSubject(SubjectRequest $request)
    {
        Subject::create([
            'subject_name'      => $request->subject_name,
            'specialization'    => $request->major,
        ]);

        if ($request->major == 0) {
            $students = Student::whereHas('degrees')->select('ssn')->get();
        } else {
            $students = Student::whereHas('degrees')->where('specialization', $request->major)->select('ssn')->get();
        }

        $subject = Subject::where('subject_name', $request->subject_name)->where('specialization', $request->major)->first();

        $degrees = [];

        foreach ($students as $student) {
            $data = [
                'student_id'    => $student->ssn,
                'subject_id'    => $subject->id,
                'degree'        => 0
            ];

            array_push($degrees, $data);
        }

        Degree::insert($degrees);

        return 'success';
    }


    public function editSubject(SubjectRequest $request)
    {
        $subject = Subject::find($request->id);

        if (!$subject)
            return 'unexists';

        if ($subject->specialization === 'علمي') {
            $major = 1;
        } else if ($subject->specialization === 'أدبي') {
            $major = 2;
        } else {
            $major = 0;
        }

        $GLOBALS['subject'] = $subject->id;

        $subject->update([
            "subject_name"      => $request->subject_name,
            "specialization"    => $request->major
        ]);

        if ($major !== $request->major) {
            if ($major == 0) {
                $first_students = Student::whereHas('degrees')->whereNot('specialization', $request->major)->get();

                $second_students = collect([]);
            } else if ($request->major == 0) {
                $first_students = collect([]);

                $second_students = Student::whereHas('degrees')->whereNot('specialization', $major)->whereDoesntHave('degrees', function ($q) {
                    $q->where('subject_id', $GLOBALS['subject']);
                })->get();
            } else {
                $first_students = Student::whereHas('degrees')->where('specialization', $major)->get();

                $second_students = Student::whereHas('degrees')->where('specialization', $request->major)->whereDoesntHave('degrees', function ($q) {
                    $q->where('subject_id', $GLOBALS['subject']);
                })->get();
            }

            if ($first_students->count() > 0) {
                $old_degrees = Degree::whereBelongsTo($first_students)->where('subject_id', $GLOBALS['subject']);

                $old_degrees->delete();
            }

            if ($second_students->count() > 0) {
                $new_degrees = [];

                foreach ($second_students as $student) {
                    $degree = [
                        'student_id'    => $student->ssn,
                        'subject_id'    => $subject->id,
                        'degree'        => 0
                    ];

                    array_push($new_degrees, $degree);
                }

                Degree::insert($new_degrees);
            }
        }

        return 'success';
    }


    public function removeSubject($request)
    {
        $subject = Subject::find($request);

        if (!$subject)
            return 'unexists';

        $old_degrees = Degree::where('subject_id', $request);

        $subject->delete();

        $old_degrees->delete();

        return 'success';
    }


    /*
        @return Subjects for major in $major param with sharing subjects, and in case $major
        equals 0 return all subjects
    */

    public function majorSubjects($major = 0)
    {
        if ($major != 0) {
            $subjects = Subject::where('specialization', '0')->orWhere('specialization', $major)->get();
        } else {
            $subjects = Subject::get();
        }

        return $subjects;
    }
}
