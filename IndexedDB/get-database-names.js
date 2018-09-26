async_test( function(t) {
  let made_database_check = t.step_func(function() {
    let idb_databases_request = indexedDB.databases();
    idb_databases_request.onsuccess = t.step_func(function() {
      assert_true(idb_databases_request.result.contains("TestDatabase"), "did not find database");
      t.done();
    });
  });
  delete_then_open(t, "TestDatabase", ()=>{}, made_database_check);
}, "Report one database test.");

async_test( function(t) {
  let done_making_databases_callback = t.step_func(function() {
    let idb_databases_request = indexedDB.databases();
    idb_databases_request.onsuccess = t.step_func(function() {
      assert_true(idb_databases_request.result.contains("TestDatabase1"), "didn't find TestDatabase1");
      assert_true(idb_databases_request.result.contains("TestDatabase2"), "didn't find TestDatabase2");
      assert_true(idb_databases_request.result.contains("TestDatabase3"), "didn't find TestDatabase3");
      t.done();
    });
  });
  let make_databases_barrier = create_barrier(done_making_databases_callback);
  delete_then_open(t, "TestDatabase1", ()=>{}, make_databases_barrier(t));
  delete_then_open(t, "TestDatabase2", ()=>{}, make_databases_barrier(t));
  delete_then_open(t, "TestDatabase3", ()=>{}, make_databases_barrier(t));
}, "Report multiple databases test.");

async_test( function(t) {
  let delete_request = indexedDB.deleteDatabase("NonExistentDatabase");
  delete_request.onsuccess = t.step_func(function() {
    let idb_databases_request = indexedDB.databases();
    idb_databases_request.onsuccess = t.step_func(function() {
      assert_false(idb_databases_request.result.contains("NonExistentDatabase"), "found excluded database");
      t.done();
    });
  });
}, "Don't report nonexistant databases test.");

done();
