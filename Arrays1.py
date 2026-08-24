# 1D list with explicit integer values
list_1d = [10, 20, 30, 40, 50]
print("1D list:", list_1d)
print("Second element (index 1):", list_1d[1])

# Insert "Estructura de datos" at position 3 (index 2)
list_1d.insert(2, "Estructura de datos")
print("\nAfter inserting 'Estructura de datos' at index 2:")
print(list_1d)

# Search for "Estructura de datos" and return its index
index_str = list_1d.index("Estructura de datos")
print("Index of 'Estructura de datos' in 1D list:", index_str)

# 2D list with explicit integer values (3x3)
list_2d = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
print("\nOriginal 2D list (3x3):")
for row in list_2d:
    print(row)

# Choose a value in the second row (index 1) to find its column index
second_row = list_2d[1]
preferred_value = 5  # we prefer the value 5
col_index = second_row.index(preferred_value)
print(f"In second row, value {preferred_value} is at column index:", col_index)

# Delete third row (index 2) and third column (index 2)
del list_2d[2]  # remove third row
for row in list_2d:
    del row[2]  # remove third column from each remaining row

print("\n2D list after removing third row and third column (now 2x2):")
for row in list_2d:
    print(row)

# After deletion, search for a preferred value in the second row (now index 1)
second_row_after = list_2d[1]
preferred_value_after = 4  # we prefer the value 4 in the second row after modification
col_index_after = second_row_after.index(preferred_value_after)
print(f"In second row after modification, value {preferred_value_after} is at column index:", col_index_after)