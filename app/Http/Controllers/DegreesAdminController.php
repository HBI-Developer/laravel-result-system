<?php

namespace App\Http\Controllers;

use App\Models\Degree;
use App\Models\Student;
use App\Models\Subject;
use App\Http\Requests\DegreeRequest;

class DegreesAdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:admin');
    }


    public function degrees()
    {
        $degrees = Student::whereHas('degrees')->with(['degrees' => function ($q) {
            $q->select('degree', 'student_id', 'subject_id')->with(['subject' => function ($q) {
                $q->select('subject_name', 'id');
            }]);
        }])->select('ssn', 'first_name', 'middle_name', 'last_name')->paginate(PAGINATION);

        $final = Student::whereHas('degrees')->select('first_name', 'middle_name', 'last_name')->withAvg('degrees as degree', 'degree')->paginate(PAGINATION);

        $students_without_degrees = Student::whereDoesntHave('degrees')->select('ssn', 'first_name', 'middle_name', 'last_name', 'specialization')->get();

        $major = $students_without_degrees[0]->specialization === 'أدبي' ? 2 : 1;

        $subjects = Subject::where('specialization', '0')->orWhere('specialization', $major)->get();

        return view('admin.degrees', compact('degrees', 'final', 'students_without_degrees', 'subjects'));
    }


    public function addNewDegrees(DegreeRequest $request)
    {
        $degrees = [];

        $request_degrees = collect(json_decode($request->degrees));

        foreach ($request_degrees as $key => $degree) {
            $data = [
                "student_id"    => $request->student,
                "subject_id"    => $key,
                "degree"        => $degree
            ];

            array_push($degrees, $data);
        }

        Degree::insert($degrees);

        return 'success';
    }


    public function editDegrees(DegreeRequest $request)
    {
        $request_degrees = collect(json_decode($request->degrees));

        $stored_degrees = Degree::where('student_id', $request->student)->get();

        $subjects_ids = $request_degrees->keys();

        $new_degrees = collect([]);

        $old_degrees = collect([]);

        foreach ($subjects_ids as $id) {
            foreach ($stored_degrees as $degree) {
                if ($degree->subject_id === $id) {
                    if ($degree->degree != $request_degrees->get($id)) {
                        $newDegree = [
                            'id'            => $degree->id,
                            'subject_id'    => $id,
                            'student_id'    => $request->student,
                            'degree'        => $request_degrees->get($id)
                        ];

                        $new_degrees->push($newDegree);

                        $old_degrees->push($degree->id);
                    }

                    break;
                }
            }
        }

        if ($old_degrees->count() > 0) {
            Degree::whereIn('id', $old_degrees)->delete();

            Degree::insert($new_degrees);
        }

        return 'success';
    }


    public function removeDegrees($request)
    {
        $degrees = Degree::where('student_id', $request);

        if (!$degrees)
            return 'unexists';

        $degrees->delete();

        return 'success';
    }

    /*
        @return degrees for certain student that has $ssn with subject name for each degree
    */

    public function studentDegrees($ssn)
    {
        $student = Student::whereHas('degrees')->with(['degrees' => function ($q) {

            $q->select('degree', 'student_id', 'subject_id')->with(['subject' => function ($q) {

                $q->select('subject_name', 'id');
            }]);
        }])->where("ssn", $ssn)->select('ssn', 'first_name', 'middle_name', 'last_name')->get();

        return $student;
    }

    /*
        @param $degrees_type is that degrees is [details] degrees or [total] degrees
        @param $state is that degrees for certain state [state = number] or all country [state = 0]

        @return degrees with params conditions
    */

    public function degreesPage($degrees_type, $state = 0)
    {
        if ($degrees_type === "details") {
            if ($state == 0) {
                $degrees = Student::whereHas('degrees')->with(['degrees' => function ($q) {

                    $q->select('degree', 'student_id', 'subject_id')->with(['subject' => function ($q) {

                        $q->select('subject_name', 'id');
                    }]);
                }])->select('ssn', 'first_name', 'middle_name', 'last_name')->paginate(PAGINATION);
            } else {
                $degrees = Student::where('state', $state)->whereHas('degrees')->with(['degrees' => function ($q) {

                    $q->select('degree', 'student_id', 'subject_id')->with(['subject' => function ($q) {

                        $q->select('subject_name', 'id');
                    }]);
                }])->select('ssn', 'first_name', 'middle_name', 'last_name')->paginate(PAGINATION);
            }
        } else {
            if ($state == 0) {
                $degrees = Student::whereHas('degrees')->select('first_name', 'middle_name', 'last_name')->withAvg('degrees as degree', 'degree')->paginate(PAGINATION);
            } else {
                $degrees = Student::where('state', $state)->whereHas('degrees')->select('first_name', 'middle_name', 'last_name')->withAvg('degrees as degree', 'degree')->paginate(PAGINATION);
            }
        }

        return $degrees;
    }
}
