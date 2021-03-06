import React, { memo } from "react"
import { useDispatch } from "react-redux"
import { Formik, Form } from "formik"
import * as yup from "yup"
import { CustomField } from "../../Common/CustomForm/CustomField"
import { IInventory } from "../../../interface/database"
import s from "./List.module.scss"
import { updateInventory } from "../../../redux/database-reducer"
import { IDependency } from "../../../utils/funcHelpers"
import { Room } from "./Room/Room"
import { Edit } from "./Edit/Edit"

export interface IInitialValues {
  name: string
  count: string
}

export const validationSchema = yup.object({
  name: yup
    .string()
    .min(3, "Минимум 3 буквы")
    .max(30, "Максимум 30 букв")
    .required("Введите предмет"),
  count: yup
    .number()
    .typeError("Только цифры")
    .required("Введите название задачи"),
})

interface IProps {
  currenName: string
  currenNode: string
  dependency: IDependency
  create: boolean
  setCreate: (value: React.SetStateAction<boolean>) => void
  edit: boolean
  setEdit: (value: React.SetStateAction<boolean>) => void
  currentInventory: Array<IInventory>
  handleDelete: (id: string) => void
  handleUpdate?: (id: string) => void
}

export const List = memo<IProps>(
  ({
    currenName,
    currenNode,
    dependency,
    create,
    setCreate,
    edit,
    setEdit,
    currentInventory,
    handleDelete,
  }) => {
    const dispatch = useDispatch()
    return (
      <>
        <h2 className={s.title}>{currenName}</h2>

        {currentInventory.length === 0 && (
          <div className={s.notFound}>
            <p className={s.itemsNotFound}>
              В выбранном помещении нет оборудования
            </p>
          </div>
        )}

        {dependency.keys[0].length === 1 ? (
          <Room
            dependency={dependency}
            currentInventory={currentInventory}
            setCreate={setCreate}
            create={create}
            edit={edit}
            setEdit={setEdit}
          />
        ) : null}

        {currentInventory.map((inventory: IInventory) => (
          <div className={s.listPage} key={inventory.id}>
            <Formik
              validateOnChange={true}
              initialValues={{
                name: inventory.name,
                count: inventory.count,
              }}
              validationSchema={validationSchema}
              enableReinitialize={true}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                setSubmitting(false)

                resetForm()

                dispatch(
                  updateInventory({
                    id: inventory.id,
                    count: values.count,
                    name: values.name,
                    placeId: currenNode,
                  })
                )
              }}
            >
              {({ isSubmitting }) => {
                return (
                  <Form>
                    <div className={s.form}>
                      <h3 className={s.titleForObj}>Название оборудования</h3>

                      <Edit
                        isSubmitting={isSubmitting}
                        handleDelete={handleDelete}
                        id={inventory.id}
                        edit={edit}
                      />
                    </div>
                  </Form>
                )
              }}
            </Formik>
          </div>
        ))}
      </>
    )
  }
)
