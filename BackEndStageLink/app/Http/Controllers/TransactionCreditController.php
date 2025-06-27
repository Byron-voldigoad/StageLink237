<?php

namespace App\Http\Controllers;

use App\Models\TransactionCredit;
use Illuminate\Http\Request;

class TransactionCreditController extends Controller
{
    public function index()
    {
        return response()->json(TransactionCredit::all());
    }

    public function store(Request $request)
    {
        $transaction = TransactionCredit::create($request->all());
        return response()->json($transaction, 201);
    }

    public function show($id)
    {
        return response()->json(TransactionCredit::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $transaction = TransactionCredit::findOrFail($id);
        $transaction->update($request->all());
        return response()->json($transaction);
    }

    public function destroy($id)
    {
        TransactionCredit::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
