<?php

namespace App\Http\Controllers;

use App\Models\Degree;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Validation\Rule;
use App\Http\Requests\StudentRequest;
use Illuminate\Support\Facades\Validator;

class StudentsAdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:admin');
    }


    public function students()
    {
        $students = Student::paginate(PAGINATION);

        return view('admin.students', compact('students'));
    }


    public function studentsPage($state = 0)
    {
        if ($state == 0) {
            $students = Student::paginate(PAGINATION);
        } else {
            $students = Student::where('state', $state)->paginate(PAGINATION);
        }

        return $students;
    }


    public function addNewStudent(StudentRequest $request)
    {
        $rules = $this->getRules();

        $messages = $this->getMessages();

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails())
            return $validator->errors();

        Student::create([
            'ssn'               => intval($request->ssn),
            'first_name'        => $request->first_name,
            'middle_name'       => $request->middle_name,
            'last_name'         => $request->last_name,
            'age'               => $request->age,
            'gender'            => $request->gender,
            'school'            => $request->school,
            'state'             => $request->state,
            'sitting_number'    => $request->sitting_number,
            'specialization'    => $request->major
        ]);

        return 'success';
    }


    public function editStudent(StudentRequest $request)
    {
        $student = Student::where('ssn', intval($request->ssn))->get();

        if (!$student)
            return 'unexists';

        $ssn = $student[0]->ssn;

        $major = $student[0]->major;

        $rules = $this->getRules(2, $ssn, $student[0]->sitting_number);

        $messages = $this->getMessages();

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails())
            return $validator->errors();

        $student[0]->update([
            'first_name'        => $request->first_name,
            'middle_name'       => $request->middle_name,
            'last_name'         => $request->last_name,
            'age'               => $request->age,
            'gender'            => $request->gender,
            'school'            => $request->school,
            'state'             => $request->state,
            'sitting_number'    => $request->sitting_number,
            'specialization'    => $request->major
        ]);

        if ($request->major !== $major) {
            $subjects = Subject::whereNot('specialization', 0)->get();

            $subjects2 = Subject::where('specialization', $request->major)->get();

            $old_degrees = Degree::whereBelongsTo($subjects)->where('student_id', $ssn);

            $new_degrees = [];

            foreach ($subjects2 as $subject) {
                $degree = [
                    'subject_id'    => $subject->id,
                    'degree'        => 0,
                    'student_id'    => $ssn,
                ];

                array_push($new_degrees, $degree);
            }

            $old_degrees->delete();

            Degree::insert($new_degrees);
        }

        return 'success';
    }


    public function removeStudent($request)
    {
        $student = Student::where('ssn', $request);

        if (!$student)
            return 'unexists';

        $student->delete();
        return 'success';
    }


    /* 
        @param $type: Is that [new = 1] or [edit = 2]
        @param $ssn: In case edit has except value for SSN
        @param $sitting_number: In case edit has except value for Sitting Number

        @return Rules that use to vaildate SSN and sitting number
    */

    public function getRules($type = 1, $ssn = null, $sitting_number = null)
    {

        $rules = [];
        switch ($type) {
            case 1: {
                    $rules = [
                        "ssn"               => 'required|integer|unique:students,ssn|min:1000000000|max:9999999999',
                        "sitting_number"    => 'required|integer|unique:students,sitting_number|min:100000|max:999999'
                    ];
                    break;
                }

            case 2: {
                    $rules = [
                        "ssn" => [
                            'required',
                            'integer',
                            'min:1000000000',
                            'max:9999999999',
                            Rule::unique('students', 'ssn')->ignore($ssn, 'ssn')
                        ],
                        "sitting_number" => [
                            'required',
                            'integer',
                            'max:999999',
                            'min:100000',
                            Rule::unique('students', 'sitting_number')->ignore($sitting_number, 'sitting_number')
                        ]
                    ];
                    break;
                }

            default: {
                    return;
                }
        }

        return $rules;
    }


    /*
        @return messages for rules of validator in getRules function
    */

    public function getMessages()
    {
        $messages = [
            "ssn.required"              => 'لا يمكنك ترك هذا الحقل فارغاً.',
            "ssn.integer"               => 'يجب أن يحتوي هذا الحقل على أرقام فقط.',
            "ssn.unique"                => 'هذا الرقم الوطني مسجّل مسبقاً.',
            "ssn.min"                   => 'يجب أن يتكوّن الرقم الوطني من 10 أرقام.',
            "ssn.max"                   => 'يجب أن يتكوّن الرقم الوطني من 10 أرقام.',
            "sitting_number.required"   => 'لا يمكنك ترك هذا الحقل فارغاً.',
            "sitting_number.integer"    => 'يجب أن يحتوي هذا الحقل على أرقام فقط.',
            "sitting_number.unique"     => 'رقم الجلوس هذا مسجّل مسبقاً.',
            "sitting_number.min"        => 'يجب أن يتكوّن رقم الجلوس من 6 أرقام.',
            "sitting_number.max"        => 'يجب أن يتكوّن رقم الجلوس من 6 أرقام.'
        ];

        return $messages;
    }
}
