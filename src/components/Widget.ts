import Swal, { SweetAlertOptions } from "sweetalert2";

type IconType = "info" | "success" | "error" | "warning" | "question";

class Widget {
  private dialog!: typeof Swal;

  constructor() {
    this.dialog = Swal;
  }

  alert(option: SweetAlertOptions) {
    return this.dialog.fire(option);
  }

  alertSuccess(title: string = "Success", content: string) {
    return this.dialog.fire({
      title: title,
      text: content,
      icon: "success",
      heightAuto: false,
    });
  }
  

  alertError(title: string = "Error", content: string) {
    return this.dialog.fire({
      title: title,
      text: content,
      icon: "error",
      html: content,
      heightAuto: false,
    });
  }

  confirm(
    title = "Are you sure?",
    content = "You won't be able to revert this!",
    confirmButtonText = "Confirm"
  ) {
    const config: SweetAlertOptions = {
      title,
      text: content,
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#230f33",
      cancelButtonColor: "#f87272",
      confirmButtonText,
      heightAuto: false,
    };

    return this.dialog.fire(config);
  }

  confirmLogout = async () => {
    return Swal.fire({
      title: "Confirm logout",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#230f33",
      cancelButtonColor: "#f87272",
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
    });
  };

  loading(title: string = "Loading...") {
    this.dialog.fire({
      title,
      didOpen: () => {
        this.dialog.showLoading();
      },
      heightAuto: false,
    });
  }

  toast(title: string, icon: IconType = "info") {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
      heightAuto: false,
    });

    Toast.fire({
      icon,
      title,
    });
  }
}

const widget = new Widget();

export { widget };
